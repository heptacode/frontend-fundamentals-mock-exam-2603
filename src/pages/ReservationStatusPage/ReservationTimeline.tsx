import { useQueries, useQuery } from '@tanstack/react-query';
import * as Timeline from 'components/Timeline';
import { useState } from 'react';
import { Tooltip } from 'components/Tooltip';
import { getReservations, getRooms } from 'pages/remotes';
import { EQUIPMENT_LABELS } from 'utils/constants';

const TIMELINE_START = 9;
const TIMELINE_END = 20;

export function ReservationTimeline({ date }: { date: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: rooms = [] } = useQuery(getRooms.queryOptions());
  const { data: reservations = [] } = useQuery(getReservations.queryOptions(date));

  return (
    <Timeline.Root start={TIMELINE_START} end={TIMELINE_END}>
      <Timeline.Header />
      {rooms.map((room, index) => {
        const roomReservations = reservations.filter(reservation => reservation.roomId === room.id);
        return (
          <Timeline.Row key={room.id} label={room.name} index={index}>
            {roomReservations.map(reservation => {
              const isActive = activeId === reservation.id;

              return (
                <Timeline.Block
                  key={reservation.id}
                  start={reservation.start}
                  end={reservation.end}
                  aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
                  isActive={isActive}
                  onClick={() => setActiveId(isActive ? null : reservation.id)}
                >
                  {isActive && (
                    <Tooltip>
                      <div>
                        {reservation.start} ~ {reservation.end}
                      </div>
                      <div>{reservation.attendees}명</div>
                      {reservation.equipment.length > 0 && (
                        <div>{reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}</div>
                      )}
                    </Tooltip>
                  )}
                </Timeline.Block>
              );
            })}
          </Timeline.Row>
        );
      })}
    </Timeline.Root>
  );
}
