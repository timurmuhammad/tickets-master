export async function setCookie(name, value, hours = 3 * 24) {
    const date = new Date()
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000))
    const expires = date.toUTCString()

    const data = {
        name,
        value,
        hours,
        expires
    }

    try {
        // Making a fetch request to the Next.js API route
        const response = await fetch('/api/cookie/setCookie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            // If the HTTP status code is not okay, throw an error
            throw new Error('Failed to set cookie')
        }

        // Optionally, handle the response data
        return await response.json()
    } catch (error) {
        console.error('Error setting cookie:', error)
    }
}