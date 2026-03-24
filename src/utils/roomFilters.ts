import type { Equipment, Reservation, Room } from '_tosslib/server/types';

type FilterOptions = Pick<Reservation, 'date' | 'start' | 'end' | 'attendees' | 'equipment'> & {
  preferredFloor: number | null;
};

/**
 * 회의실 목록에서 중복 없는 층 목록을 정렬하여 반환합니다.
 */
export function getUniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
}

/**
 * 조건에 맞는 예약 가능한 회의실을 필터링하고 정렬하여 반환합니다.
 */
export function filterAvailableRooms(rooms: Room[], reservations: Reservation[], options: FilterOptions): Room[] {
  const { attendees, equipment, preferredFloor, date, start, end } = options;

  return rooms
    .filter(room => {
      // 수용 인원 체크
      if (room.capacity < attendees) return false;

      // 필요 장비 체크
      if (!equipment.every(eq => eq && room.equipment.includes(eq))) return false;

      // 선호 층 체크
      if (preferredFloor !== null && room.floor !== preferredFloor) return false;

      // 예약 충돌 체크
      const hasConflict = reservations.some(
        r => r.roomId === room.id && r.date === date && r.start < end && r.end > start
      );
      if (hasConflict) return false;

      return true;
    })
    .sort((a, b) => {
      // 층 우선 정렬, 같은 층이면 이름 순
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}
