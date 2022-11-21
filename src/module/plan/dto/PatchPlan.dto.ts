import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AlarmEnum } from '../types/Alarm.enum';

export class PatchPlanDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDateString()
  @IsOptional()
  startAt?: string;

  @IsDateString()
  @IsOptional()
  endAt?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  @IsEnum(AlarmEnum)
  @IsOptional()
  alarm?: string; // none, on-event, before-5m, before-10m
}
