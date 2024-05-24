import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

    public static getNowDateTimeString(): string {
        const now = new Date();
      
        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
      
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
}