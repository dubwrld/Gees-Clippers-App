import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, googleCalendarPlugin],
        initialView: 'dayGridMonth',
        googleCalendarApiKey: 'AIzaSyBuis_1cgirCqptSqCR-CDY6UAM6EFIEss',
        events: {
            googleCalendarId: 'aaf5e7e1b2d03c4f43808ac545d93cf536da7e9f601429d479148f5d67ae32ce@group.calendar.google.com',
            backgroundColor: 'white',
            borderColor: 'gray',
            className: 'calendarEvent',
            textColor: 'black',
            color: 'white',
            display: 'block',
        }
    });
    calendar.render();
});
//# sourceMappingURL=calendar.js.map