import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CalendarMonthOutlined, ChevronLeft, ChevronRight, } from '@mui/icons-material';
import { JOURNAL_ENTRIES } from '../data/journalEntries';
import { parseDate, formatDateKey, SHORTMONTHS } from '../utils/dateUtils';
import type { JournalEntry, MonthData } from '../types';
import CalendarMonth from './CalendarMonth';
import JournalCards from './journal-card';

const InfiniteCalendar: React.FC = () => {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState<MonthData>({ year: now.getFullYear(), month: now.getMonth() });
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const scrollContainer = useRef<HTMLDivElement>(null);
    const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const [months, setMonths] = useState<MonthData[]>(() => {
        const initial: MonthData[] = [];
        for (let i = -2; i <= 2; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            initial.push({ year: d.getFullYear(), month: d.getMonth() });
        }
        return initial;
    });


    const monthRangeRef = useRef<{ start: MonthData; end: MonthData }>({
        start: { year: now.getFullYear(), month: now.getMonth() - 2 },
        end: { year: now.getFullYear(), month: now.getMonth() + 2 }
    });

    const entriesByDate = JOURNAL_ENTRIES.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
        const key = formatDateKey(parseDate(entry.date));
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {});

    const addMonthsToStart = useCallback((count = 6) => {
        setMonths(prev => {
            const newMonths: MonthData[] = [];
            let { year, month } = monthRangeRef.current.start;

            for (let i = 0; i < count; i++) {
                month--;
                if (month < 0) {
                    month = 11;
                    year--;
                }
                newMonths.unshift({ year, month });
            }


            monthRangeRef.current = {
                ...monthRangeRef.current,
                start: { year, month }
            };

            return [...newMonths, ...prev];
        });
    }, []);

    const addMonthsToEnd = useCallback((count = 6) => {
        setMonths(prev => {
            const newMonths: MonthData[] = [];
            let { year, month } = monthRangeRef.current.end;

            for (let i = 0; i < count; i++) {
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
                newMonths.push({ year, month });
            }


            monthRangeRef.current = {
                ...monthRangeRef.current,
                end: { year, month }
            };

            return [...prev, ...newMonths];
        });
    }, []);

    const handleScroll = useCallback(() => {
        if (!scrollContainer.current || isInitialLoad) return;

        const scrollTop = scrollContainer.current.scrollTop;
        const viewHeight = scrollContainer.current.clientHeight;
        const scrollBottom = scrollTop + viewHeight;
        const scrollHeight = scrollContainer.current.scrollHeight;
        const threshold = viewHeight * 0.9; // Less sensitive threshold

        if (scrollTop < threshold) addMonthsToStart();
        if (scrollBottom > scrollHeight - threshold) addMonthsToEnd();

        // Find the most visible month
        let maxVisible = 0;
        let mostVisible = currentMonth;

        monthRefs.current.forEach((el, key) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const containerRect = scrollContainer.current!.getBoundingClientRect();
            const elementTop = rect.top - containerRect.top + scrollTop;
            const elementBottom = elementTop + rect.height;
            const visibleTop = Math.max(elementTop, scrollTop);
            const visibleBottom = Math.min(elementBottom, scrollBottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);

            if (visibleArea > maxVisible) {
                maxVisible = visibleArea;
                const [year, month] = key.split('-').map(Number);
                mostVisible = { year, month };
            }
        });

        if (mostVisible.year !== currentMonth.year || mostVisible.month !== currentMonth.month) {
            setCurrentMonth(mostVisible);
        }
    }, [currentMonth, addMonthsToStart, addMonthsToEnd, isInitialLoad]);

    useEffect(() => {
        const container = scrollContainer.current;
        if (!container) return;

        const onScroll = () => requestAnimationFrame(handleScroll);
        container.addEventListener('scroll', onScroll, { passive: true });
        return () => container.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    const scrollToMonth = (year: number, month: number) => {
        console.log('Scrolling to:', year, month);
        const el = monthRefs.current.get(`${year}-${month}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn('Month element not found:', year, month);
        }
    };

    const handlePreviousMonth = () => {
        const newMonth = currentMonth.month === 0 ? 11 : currentMonth.month - 1;
        const newYear = currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year;
        scrollToMonth(newYear, newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth.month === 11 ? 0 : currentMonth.month + 1;
        const newYear = currentMonth.month === 11 ? currentMonth.year + 1 : currentMonth.year;
        scrollToMonth(newYear, newMonth);
    };

    const handleEntryClick = (entry: JournalEntry) => {
        setSelectedEntry(entry);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Initial scroll to current month:', currentMonth.year, currentMonth.month);
            scrollToMonth(currentMonth.year, currentMonth.month);

            setTimeout(() => {
                setIsInitialLoad(false);
            }, 500);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const onModalClose = () => setSelectedEntry(null);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
                bgcolor: 'white', borderBottom: '1px solid', borderColor: 'grey.200',
                px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                minHeight: { xs: '56px', md: '66px' }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthOutlined />
                    <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '14px', md: '23px' } }}>
                        <span style={{ color: '#88D1F1' }}>My</span> Hair Dairy
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                    <IconButton onClick={handlePreviousMonth} size="small" sx={{ bgcolor: 'grey.100', cursor: 'pointer', '&:hover': { bgcolor: 'grey.200' } }}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography sx={{ minWidth: { xs: '80px', md: '180px' }, textAlign: 'center', fontWeight: 600, fontSize: { xs: '14px', md: '23px' } }}>
                        {SHORTMONTHS[currentMonth.month]} <span style={{ fontWeight: 400 }}>{currentMonth.year}</span>
                    </Typography>
                    <IconButton onClick={handleNextMonth} size="small" sx={{ bgcolor: 'grey.100', cursor: 'pointer', '&:hover': { bgcolor: 'grey.200' } }}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>

            <Box ref={scrollContainer} sx={{ flexGrow: 1, overflowY: 'auto', mt: '80px' }}>
                {months.map(({ year, month }) => {
                    const key = `${year}-${month}`;
                    return (
                        <Box key={key} ref={(el) => {
                            if (el) {
                                monthRefs.current.set(key, el as HTMLDivElement);
                            } else {
                                monthRefs.current.delete(key);
                            }
                        }}>
                            <CalendarMonth
                                year={year}
                                month={month}
                                entriesByDate={entriesByDate}
                                onEntryClick={handleEntryClick}
                                active={currentMonth.year === year && currentMonth.month === month}
                            />
                        </Box>
                    );
                })}
            </Box>

            {selectedEntry && <JournalCards targetDate={selectedEntry.date} onClose={onModalClose} />}
        </Box>
    );
};

export default InfiniteCalendar;