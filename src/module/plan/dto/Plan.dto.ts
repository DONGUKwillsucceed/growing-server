export interface PlanDto {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  description: string | null;
  location: {
    latitude: number; //default value 0
    longitude: number; // default value 0
    address: string;
  } | null;
  alarm: string;
}
