
import { headers } from 'next/headers'

export async function getNow(): Promise<Date> {
    // Check if TEST_MODE is enabled
    if (process.env.TEST_MODE === '1') {
        const headersList = await headers()
        const testNow = headersList.get('x-test-now-ms')

        if (testNow) {
            const ms = parseInt(testNow, 10)
            if (!isNaN(ms)) {
                return new Date(ms)
            }
        }
    }

    return new Date()
}
