import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Border, Button, ListRow, Select, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Equipment } from '_tosslib/server/types';
import axios from 'axios';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS, TIME_SLOTS } from 'utils/constants';
import { createReservation, getMyReservations, getReservations, getRooms } from 'pages/remotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrayParam,
  createEnumArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { formatDate } from 'utils/date';
import { useLoading } from 'hooks/useLoading';
import { Section } from 'components/Section';
import { Banner } from 'components/Banner';
import { filterAvailableRooms, getUniqueFloors } from 'utils/roomFilters';
import { AvailableRooms } from './AvailableRooms';
import { Chip } from 'components/Chip';

export function RoomBookingPage() {
  const navigate = useNavigate();

  const [{ date, start, end, attendees, equipment, floor: preferredFloor, selectedRoomId }, setParams] = useQueryParams(
    {
      date: withDefault(StringParam, formatDate(new Date())),
      start: withDefault(StringParam, ''),
      end: withDefault(StringParam, ''),
      attendees: withDefault(NumberParam, 1),
      equipment: withDefault(
        createEnumArrayParam<Equipment>(Object.keys(EQUIPMENT_LABELS) as Equipment[]),
        [] as Equipment[]
      ),
      floor: NumberParam,
      selectedRoomId: withDefault(StringParam, ''),
    }
  );
  const [isLoading, startLoading] = useLoading();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(getRooms.queryOptions());
  const { data: reservations = [], refetch: refetchReservations } = useQuery(getReservations.queryOptions(date));
  const { refetch: refetchMyReservations } = useQuery(getMyReservations.queryOptions());

  // 필터 변경 시 선택 초기화
  function handleFilterChange() {
    setParams({ selectedRoomId: '' });
    setErrorMessage(null);
  }

  // 입력 검증
  const validationError = (() => {
    if (start === '' || end === '') return null;
    if (end <= start) return '종료 시간은 시작 시간보다 늦어야 합니다.';
    if (attendees < 1) return '참석 인원은 1명 이상이어야 합니다.';
    return null;
  })();

  const isFilterComplete = start !== '' && end !== '' && !validationError;

  // 필터링
  const floors = getUniqueFloors(rooms);

  const availableRooms = isFilterComplete
    ? filterAvailableRooms(rooms, reservations, {
        attendees,
        equipment,
        preferredFloor: preferredFloor ?? null,
        date,
        start,
        end,
      })
    : [];

  async function handleBook() {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!start || !end) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await startLoading(
        createReservation({
          roomId: selectedRoomId,
          date,
          start,
          end,
          attendees,
          equipment,
        })
      );

      if ('ok' in result && result.ok) {
        refetchReservations();
        refetchMyReservations();
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setParams({ selectedRoomId: '' });
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setParams({ selectedRoomId: '' });
    }
  }

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <Section title="예약 조건">
        {/* 날짜 */}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            날짜
          </Text>
          <input
            type="date"
            value={date}
            min={formatDate(new Date())}
            onChange={e => {
              setParams({ date: e.target.value });
              handleFilterChange();
            }}
            aria-label="날짜"
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              line-height: 1.5;
              height: 48px;
              background-color: ${colors.grey50};
              border-radius: 12px;
              color: ${colors.grey800};
              width: 100%;
              border: 1px solid ${colors.grey200};
              padding: 0 16px;
              outline: none;
              transition: border-color 0.15s;
              &:focus {
                border-color: ${colors.blue500};
              }
            `}
          />
        </div>
        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              시작 시간
            </Text>
            <Select
              value={start}
              onChange={e => {
                setParams({ start: e.target.value });
                handleFilterChange();
              }}
              aria-label="시작 시간"
            >
              <option value="">선택</option>
              {TIME_SLOTS.slice(0, -1).map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              종료 시간
            </Text>
            <Select
              value={end}
              onChange={e => {
                setParams({ end: e.target.value });
                handleFilterChange();
              }}
              aria-label="종료 시간"
            >
              <option value="">선택</option>
              {TIME_SLOTS.slice(1).map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              참석 인원
            </Text>
            <input
              type="number"
              min={1}
              value={attendees}
              onChange={e => {
                setParams({ attendees: Math.max(1, Number(e.target.value)) });
                handleFilterChange();
              }}
              aria-label="참석 인원"
              css={css`
                box-sizing: border-box;
                font-size: 16px;
                font-weight: 500;
                line-height: 1.5;
                height: 48px;
                background-color: ${colors.grey50};
                border-radius: 12px;
                color: ${colors.grey800};
                width: 100%;
                border: 1px solid ${colors.grey200};
                padding: 0 16px;
                outline: none;
                transition: border-color 0.15s;
                &:focus {
                  border-color: ${colors.blue500};
                }
              `}
            />
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              선호 층
            </Text>
            <Select
              value={preferredFloor ?? ''}
              onChange={e => {
                const val = e.target.value;
                setParams({ floor: val === '' ? null : Number(val) });
                handleFilterChange();
              }}
              aria-label="선호 층"
            >
              <option value="">전체</option>
              {floors.map((f: number) => (
                <option key={f} value={f}>
                  {f}층
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <div>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            필요 장비
          </Text>
          <Spacing size={8} />
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(eq => {
              const selected = equipment.includes(eq);
              return (
                <Chip
                  key={eq}
                  selected={selected}
                  onClick={() => {
                    const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                    setParams({ equipment: next });
                    handleFilterChange();
                  }}
                  aria-label={EQUIPMENT_LABELS[eq]}
                  aria-pressed={selected}
                >
                  {EQUIPMENT_LABELS[eq]}
                </Chip>
              );
            })}
          </div>
        </div>
      </Section>

      <Spacing size={16} />

      {validationError && <Banner variant="error">{validationError}</Banner>}

      <Spacing size={8} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <Section title="예약 가능 회의실" subtitle={`${availableRooms.length}개`}>
          <AvailableRooms
            availableRooms={availableRooms}
            EmptyComponent={
              <div
                css={css`
                  padding: 40px 0;
                  text-align: center;
                  background: ${colors.grey50};
                  border-radius: 14px;
                `}
              >
                <Text typography="t6" color={colors.grey500}>
                  조건에 맞는 회의실이 없습니다.
                </Text>
              </div>
            }
          />
          <Spacing size={16} />
          <Button display="full" onClick={handleBook} disabled={isLoading}>
            {isLoading ? '예약 중...' : '확정'}
          </Button>
        </Section>
      )}

      <Spacing size={24} />
    </div>
  );
}
