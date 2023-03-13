import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AlarmEnum } from '../types/Alarm.enum';

export class CreatePlanDto {
  @IsString()
  title: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsOptional()
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  @IsEnum(AlarmEnum)
  alarm: string; // none, on-event, before-5m, before-10m
}
