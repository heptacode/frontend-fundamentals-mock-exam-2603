import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Border, Button, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Reservation } from '_tosslib/server/types';
import { DateInput } from 'components/DateInput';
import { Section } from 'components/Section';
import { cancelReservation, getMyReservations, getReservations } from 'pages/remotes';
import { useNavigate } from 'react-router-dom';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { MyReservations } from './MyReservations';
import { useLoading } from 'hooks/useLoading';
import { Banner } from 'components/Banner';
import { formatDate } from 'utils/date';
import { ReservationTimeline } from './ReservationTimeline';
import { useLocationStateMessage } from 'hooks/useLocationStateMessage';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [isLoading, startLoading] = useLoading();
  const [date, setDate] = useQueryParam('date', withDefault(StringParam, formatDate(new Date())));

  const { refetch: refetchReservations } = useQuery(getReservations.queryOptions(date));
  const { data: myReservationList = [], refetch: refetchMyReservations } = useQuery(getMyReservations.queryOptions());
  const [message, setMessage] = useLocationStateMessage();

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <Section title="날짜 선택">
        <DateInput
          value={date}
          // min={formatDate(new Date())}
          onChange={e => setDate(e.target.value)}
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <Section title="예약 현황">
        <ReservationTimeline date={date} />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && <Banner variant={message.type}>{message.text}</Banner>}

      {/* 내 예약 목록 */}
      <Section
        title="내 예약"
        subtitle={
          myReservationList.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservationList.length}건
            </Text>
          )
        }
      >
        <MyReservations
          placeholder={
            <div
              css={css`
                padding: 40px 0;
                text-align: center;
                background: ${colors.grey50};
                border-radius: 14px;
              `}
            >
              <Text typography="t6" color={colors.grey500}>
                예약 내역이 없습니다.
              </Text>
            </div>
          }
          renderRight={(reservation: Reservation) => {
            return (
              <Button
                type="danger"
                style="weak"
                size="small"
                disabled={isLoading}
                onClick={async e => {
                  e.stopPropagation();
                  if (window.confirm('정말 취소하시겠습니까?')) {
                    try {
                      await startLoading(cancelReservation(reservation.id));
                      refetchReservations();
                      refetchMyReservations();
                      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
                    } catch {
                      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
                    }
                  }
                }}
              >
                취소
              </Button>
            );
          }}
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
