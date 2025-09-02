import React from 'react';
import { Box, Typography, Paper, Rating } from '@mui/material';
import { generateCalendarDays, formatDateKey, SHORTMONTHS } from '../utils/dateUtils';
import type { JournalEntry } from '../types';



interface CalendarMonthProps {
    year: number;
    month: number;
    entriesByDate: Record<string, JournalEntry[]>;
    onEntryClick: (entry: JournalEntry) => void;
    active: boolean;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
    year,
    month,
    entriesByDate,
    onEntryClick,
    active
}) => {
    const days = generateCalendarDays(year, month);


    return (
        <Box sx={{ mb: { xs: '-99px', md: '-208px' }, color: 'green' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {days.map((day, index) => {
                    if (!day) {
                        return <Box key={index} sx={{
                            width: '55px',
                            height: '80px',
                        }} />;
                    }
                    const date = new Date(year, month, day);
                    const dateKey = formatDateKey(date);
                    const entries = entriesByDate[dateKey] || [];

                    return (
                        <Paper
                            key={index}
                            variant="outlined"
                            sx={{
                                aspectRatio: { xs: '0', md: '1' },
                                textAlign: 'center',
                                borderRadius: '0px',
                                backgroundColor: index === 0 || index % 7 === 0 ? '#EBE9EB' : '#FFFFFF',
                                width: { xs: '56px', sm: '110px', md: 'auto' },
                                height: { xs: '100px', md: 'auto' },
                                position: 'relative',
                                border: '0.5px solid',
                                borderColor: 'grey.100'
                            }}
                        >
                            <Typography sx={{ color: active ? 'black' : 'text.secondary', mb: 0.5, display: 'block', fontWeight: active ? 600 : 400, fontSize: { xs: '0.75rem', md: '18px' } }}>
                                {day} <span style={{ color: 'grey' }}>{day === 1 ? SHORTMONTHS[month] : ''}</span>
                            </Typography>
                            {entries.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', mt: '-10px' }}>
                                    {entries.slice(0, 1).map((entry, entryIndex) => (
                                        <Box
                                            key={entryIndex}
                                            onClick={() => onEntryClick(entry)}
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: 1,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Rating
                                                value={entry.rating}
                                                readOnly
                                                sx={{
                                                    fontSize: { xs: '9px', md: '18px' },
                                                    alignItems: 'center',
                                                    "& .MuiRating-icon": {
                                                        color: "#88D1F1",
                                                    },
                                                }}
                                            />
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}>
                                                <Box
                                                    component="img"
                                                    src={entry.imgUrl}
                                                    alt="Journal entry"
                                                    sx={{
                                                        maxHeight: { xs: 60, md: 140 },
                                                        width: '100%',
                                                        objectFit: 'contain',
                                                        borderRadius: '4px',

                                                    }}
                                                />
                                            </div>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default CalendarMonth