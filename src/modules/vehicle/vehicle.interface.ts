
export enum VehicleType {
    CAR = "car",
    BIKE = "bike",
    VAN = "van",
    SUV = "SUV",
}

export enum VehicleStatus {
    AVAILABLE = "available",
    BOOKED = "booked",
}

export interface ICreateVehicle {
  vehicle_name: string;
  type: VehicleType;
  registration_number: string;
  daily_rent_price: number;
//   availability_status: VehicleStatus;
}
