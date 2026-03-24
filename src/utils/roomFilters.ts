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

function hasCapacity(room: Room, attendees: number): boolean {
  return room.capacity >= attendees;
}

function hasRequiredEquipment(room: Room, equipment: Equipment[]): boolean {
  return equipment.every(eq => eq && room.equipment.includes(eq));
}

function isOnPreferredFloor(room: Room, preferredFloor: number | null): boolean {
  return preferredFloor === null || room.floor === preferredFloor;
}

function hasNoConflict(room: Room, reservations: Reservation[], date: Reservation['date'], start: Reservation['start'], end: Reservation['end']): boolean {
  return !reservations.some(r => r.roomId === room.id && r.date === date && r.start < end && r.end > start);
}

function compareByFloorThenName(a: Room, b: Room): number {
  return a.floor - b.floor || a.name.localeCompare(b.name);
}

/**
 * 조건에 맞는 예약 가능한 회의실을 필터링하고 정렬하여 반환합니다.
 */
export function filterAvailableRooms(rooms: Room[], reservations: Reservation[], options: FilterOptions): Room[] {
  const { attendees, equipment, preferredFloor, date, start, end } = options;

  return rooms
    .filter(room =>
      hasCapacity(room, attendees) &&
      hasRequiredEquipment(room, equipment) &&
      isOnPreferredFloor(room, preferredFloor) &&
      hasNoConflict(room, reservations, date, start, end)
    )
    .sort(compareByFloorThenName);
}
