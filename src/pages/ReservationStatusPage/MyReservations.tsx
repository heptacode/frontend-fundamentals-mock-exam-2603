import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Reservation } from '_tosslib/server/types';
import { getMyReservations, getRooms } from 'pages/remotes';
import { EQUIPMENT_LABELS } from 'utils/constants';

export function MyReservations({
  EmptyComponent,
  renderRight,
}: {
  EmptyComponent: React.ReactNode;
  renderRight: (reservation: Reservation) => React.ReactNode;
}) {
  const { data: rooms = [] } = useQuery(getRooms.queryOptions());
  const { data: myReservations = [] } = useQuery(getMyReservations.queryOptions());

  function getRoomName(roomId: string) {
    return rooms.find((room: { id: string; name: string }) => room.id === roomId)?.name ?? roomId;
  }

  return (
    <>
      {myReservations.length === 0 ? (
        EmptyComponent
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {myReservations.map(reservation => (
            <div
              key={reservation.id}
              css={css`
                padding: 14px 16px;
                border-radius: 14px;
                background: ${colors.grey50};
                border: 1px solid ${colors.grey200};
              `}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={getRoomName(reservation.roomId)}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${
                      reservation.attendees
                    }명 · ${reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={renderRight(reservation)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
