
export function toStringDate(string: string): string {
    const date: Date = new Date(string);
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit'
    })
}