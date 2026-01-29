
import React from 'react';
import { HailIcon, WindIcon, SnowflakeIcon } from './icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';

// Mock data, to be replaced by props
const mockEvents = [
    { event: 'Hail', date: '2023-08-15', severity: '1.25-inch hail', icon: HailIcon, color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
    { event: 'Wind', date: '2022-09-22', severity: '55 mph gusts', icon: WindIcon, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { event: 'Ice Storm', date: '2022-01-20', severity: 'Significant ice accumulation', icon: SnowflakeIcon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { event: 'Hail', date: '2021-07-03', severity: '0.75-inch hail', icon: HailIcon, color: 'text-pink-400', bgColor: 'bg-pink-500/20' }
];

interface WeatherReportProps {
    onDateSelect?: (date: string) => void;
}

export const WeatherReport: React.FC<WeatherReportProps> = ({ onDateSelect }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Severity</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockEvents.map((item, index) => (
                    <TableRow 
                        key={index} 
                        className={cn(
                            "border-gray-800 transition-colors",
                            onDateSelect ? "cursor-pointer hover:bg-gray-800/50" : ""
                        )}
                        onClick={() => onDateSelect && onDateSelect(item.date)}
                    >
                        <TableCell>
                            <div className="flex items-center">
                                <item.icon className={`h-5 w-5 mr-2 ${item.color}`} />
                                <span>{item.event}</span>
                            </div>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.bgColor} ${item.color}`}>
                                {item.severity}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
