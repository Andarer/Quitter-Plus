import { useState, useEffect, useMemo } from 'react';
import { Tracker, HealthMilestone } from '../types';
import { HEALTH_MILESTONES } from '../constants/initialData';

export interface TrackerStats {
  elapsedMs: number;
  totalDays: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  moneySaved: number;
  itemsAvoided: number;
  timeRegainedHours: number;
  nextMilestone: HealthMilestone | null;
  milestoneProgressPercent: number;
}

export function useTracker(tracker: Tracker | undefined): TrackerStats {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // 1-second tick for live timer
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!tracker) {
      return {
        elapsedMs: 0,
        totalDays: 0,
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        moneySaved: 0,
        itemsAvoided: 0,
        timeRegainedHours: 0,
        nextMilestone: null,
        milestoneProgressPercent: 0,
      };
    }

    const startMs = new Date(tracker.startDate).getTime();
    const elapsedMs = Math.max(0, now - startMs);

    const totalSeconds = Math.floor(elapsedMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDaysFloat = elapsedMs / (1000 * 60 * 60 * 24);
    const totalDays = Math.floor(totalDaysFloat);

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Money saved
    const moneySaved = Math.max(0, totalDaysFloat * (tracker.costPerDay || 0));

    // Items avoided
    const itemsAvoided = Math.floor(totalDaysFloat * (tracker.itemsPerDay || 0));

    // Time regained
    const timeRegainedMinutes = itemsAvoided * (tracker.timeSavedPerItemMin || 0);
    const timeRegainedHours = Math.round((timeRegainedMinutes / 60) * 10) / 10;

    // Health Milestone Calculation
    const relevantMilestones = HEALTH_MILESTONES.filter(
      (m) => m.category === 'general' || m.category === tracker.category
    ).sort((a, b) => a.hours - b.hours);

    const elapsedHours = totalDaysFloat * 24;
    const nextMilestone = relevantMilestones.find((m) => m.hours > elapsedHours) || null;

    let milestoneProgressPercent = 100;
    if (nextMilestone) {
      const prevHours = relevantMilestones
        .filter((m) => m.hours < nextMilestone.hours)
        .reduce((max, m) => Math.max(max, m.hours), 0);
      
      const interval = nextMilestone.hours - prevHours;
      const progressInInterval = Math.max(0, elapsedHours - prevHours);
      milestoneProgressPercent = Math.min(100, Math.round((progressInInterval / interval) * 100));
    }

    return {
      elapsedMs,
      totalDays,
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      moneySaved,
      itemsAvoided,
      timeRegainedHours,
      nextMilestone,
      milestoneProgressPercent,
    };
  }, [tracker, now]);
}
