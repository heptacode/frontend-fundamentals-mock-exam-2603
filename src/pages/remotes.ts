import { UseQueryOptions } from '@tanstack/react-query';
import type { Reservation, Room } from '_tosslib/server/types';
import { http } from 'pages/http';

export function getRooms() {
  return http.get<Room[]>(getRooms.apiPath());
}
getRooms.apiPath = () => '/api/rooms';
getRooms.queryOptions = () =>
  ({
    queryKey: [getRooms.apiPath()],
    queryFn: getRooms,
  } satisfies UseQueryOptions<Room[]>);

export function getReservations(date: string) {
  return http.get<Reservation[]>(getReservations.apiPath(date));
}
getReservations.apiPath = (date: string) => `/api/reservations?date=${date}`;
getReservations.queryOptions = (date: string) =>
  ({
    queryKey: [getReservations.apiPath(date)],
    queryFn: () => getReservations(date),
  } satisfies UseQueryOptions<Reservation[]>);

export function createReservation(data: Omit<Reservation, 'id'>) {
  return http.post<typeof data, { ok: boolean; reservation?: unknown; code?: string; message?: string }>(
    '/api/reservations',
    data
  );
}

export function getMyReservations() {
  return http.get<Reservation[]>(getMyReservations.apiPath());
}
getMyReservations.apiPath = () => '/api/my-reservations';
getMyReservations.queryOptions = () =>
  ({
    queryKey: [getMyReservations.apiPath()],
    queryFn: getMyReservations,
  } satisfies UseQueryOptions<Reservation[]>);

export function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}
