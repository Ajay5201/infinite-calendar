
import { Close } from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Fade,
    IconButton,
    LinearProgress,
    Modal,
    Rating,
    Stack,
    Typography
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { JOURNAL_ENTRIES } from "../data/journalEntries";

const MotionBox = motion(Box);

interface JournalCardsProps {
    targetDate: string;
    onClose: () => void;
}

const JournalCards: React.FC<JournalCardsProps> = ({ targetDate, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const totalQuestions = JOURNAL_ENTRIES.length;
    useEffect(() => {
        if (targetDate) {
            const index = JOURNAL_ENTRIES.findIndex(entry => entry.date === targetDate);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [targetDate]);

    const currentEntry = JOURNAL_ENTRIES[currentIndex];
    const handleDragEnd = (_: any, info: any) => {
        const threshold = 50;
        if (Math.abs(info.offset.x) > threshold) {
            if (info.offset.x > 0 && currentIndex > 0) {
                setDirection(-1);
                setCurrentIndex((prev) => prev - 1);
            } else if (info.offset.x < 0 && currentIndex < totalQuestions - 1) {
                setDirection(1);
                setCurrentIndex((prev) => prev + 1);
            }
        }
    };

    const cardVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const formatDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <>

            <Modal
                open={!!targetDate}
                onClose={() => onClose()}
                closeAfterTransition
                sx={{ borderColor: 'green' }}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: "black" },

                }}
            >
                <Fade in={!!targetDate}>

                    <Stack spacing={3} width="100%" maxWidth={400} mx="auto" px={2} sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: 2,
                        p: 4,
                        minWidth: 300,
                        borderColor: 'green'
                    }}>

                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: { xs: 50, md: 12 },
                                right: { xs: 20, md: 10 },
                                zIndex: 20,
                                bgcolor: 'grey',
                                color: 'white',
                                backdropFilter: 'blur(8px)',
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.8)'
                                }
                            }}
                        >
                            <Close />
                        </IconButton>

                        <Box position="relative" width="100%" height={630}>
                            <AnimatePresence initial={false} custom={direction}>
                                <MotionBox
                                    key={currentIndex}
                                    custom={direction}
                                    variants={cardVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={handleDragEnd}
                                    whileTap={{ cursor: "grabbing" }}
                                    // onClick={() => onClose()}
                                    sx={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(255, 255, 255, 0.95)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        border: "1px solid rgba(255, 255, 255, 0.3)",
                                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                        cursor: "pointer",
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                        },
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "70%",
                                            backgroundImage: `url(${currentEntry.imgUrl})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            position: "relative",
                                        }}
                                    >
                                    </Box>

                                    <Box sx={{ height: "40%" }}>
                                        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <Box display={'flex'} justifyContent={'space-between'}>

                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: "50%",
                                                        background: "rgba(233, 210, 233, 0.9)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        color: "#666",
                                                    }}
                                                >
                                                    {currentEntry.categories[0].slice(0, 1)}
                                                </Box>

                                                <Rating
                                                    value={currentEntry.rating}
                                                    readOnly

                                                    precision={0.1}
                                                    size="small"
                                                    sx={{
                                                        alignItems: 'center',
                                                        "& .MuiRating-icon": {
                                                            color: "#88D1F1",
                                                        },
                                                    }}
                                                />

                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: "#333",
                                                    fontWeight: 600,
                                                    mb: 1,
                                                }}
                                            >
                                                {formatDate(currentEntry.date)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#666",
                                                    lineHeight: 1.4,
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {currentEntry.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 1.5, borderTop: '1px solid black' }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    p: 1,
                                                    color: "#333",
                                                    fontWeight: 800,
                                                    textAlign: "center",

                                                }}
                                            >
                                                View full Post
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            </AnimatePresence>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={(currentIndex + 1) * (100 / totalQuestions)}
                            sx={{
                                width: "100%",
                                height: 8,
                                borderRadius: 5,
                                background: "rgba(255, 255, 255, 0.1)",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#9c27b0",
                                },
                            }}
                        />
                    </Stack>
                </Fade>
            </Modal>
        </>
    );
};

export default JournalCards;