import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'secondsTime'
})
export class SecondsTime implements PipeTransform{
    transform(value: string, ...args: any[]) {
        let mValue = Math.floor(Number(value))
        let hours = Math.floor(mValue / 3600)
        let totalSeconds = mValue %= 3600
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        return `${hours}:${minutes}:${seconds}`
    }
}