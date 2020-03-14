import { APPOINTMENT_LOCAL_UPDATE } from '../actionTypes';

export const updateAppointmentState = (appointment) => {
  return {
    type: APPOINTMENT_LOCAL_UPDATE,
    payload: appointment
  }
}
