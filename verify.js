const baseUrl = 'http://localhost:3000/api/pastes';

async function test() {
    console.log('Starting verification...');

    // 1. Create normal paste
    console.log('1. Creating normal paste...');
    const res1 = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Hello World', expiresIn: null, burnAfterRead: false })
    });
    if (!res1.ok) throw new Error('Failed to create paste');
    const { slug: slug1 } = await res1.json();
    console.log('   Created:', slug1);

    // 2. Read normal paste
    console.log('2. Reading normal paste...');
    const res2 = await fetch(`${baseUrl}/${slug1}`);
    if (!res2.ok) throw new Error('Failed to read paste');
    const data2 = await res2.json();
    if (data2.content !== 'Hello World') throw new Error('Content mismatch');
    console.log('   Read success');

    // 3. Create burn-after-read paste
    console.log('3. Creating burn-after-read paste...');
    const res3 = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Secret', expiresIn: null, burnAfterRead: true })
    });
    const { slug: slug3 } = await res3.json();
    console.log('   Created:', slug3);

    // 4. Read burn-after-read paste (First time) - should succeed
    console.log('4. Reading burn paste (1st time)...');
    const res4 = await fetch(`${baseUrl}/${slug3}`);
    if (!res4.ok) throw new Error('Failed to read burn paste 1st time');
    const data4 = await res4.json();
    if (data4.content !== 'Secret') throw new Error('Content mismatch');
    console.log('   Read success');

    // 5. Read burn-after-read paste (Second time) - should fail
    console.log('5. Reading burn paste (2nd time)...');
    const res5 = await fetch(`${baseUrl}/${slug3}`);
    if (res5.status !== 410) throw new Error(`Expected 410, got ${res5.status}`);
    console.log('   Burned check success');

    // 6. Create expired paste
    console.log('6. Creating expired paste...');
    // 0.001 minutes ~ 0.06 seconds. 
    // Note: date-fns addMinutes might truncate or round? Let's assume it accepts float.
    // standard helper `addMinutes` usually works with integers in some libs, but `date-fns` v4? 
    // Implementation: `addMinutes(new Date(), expiresIn)` -> `amount` is number.
    // If it doesn't work, we'll see.
    const res6 = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Expired', expiresIn: 0.001, burnAfterRead: false })
    });
    const { slug: slug6 } = await res6.json();
    console.log('   Created:', slug6);

    // Wait 1 second
    console.log('   Waiting 1s...');
    await new Promise(r => setTimeout(r, 1000));

    // 7. Read expired paste
    console.log('7. Reading expired paste...');
    const res7 = await fetch(`${baseUrl}/${slug6}`);
    if (res7.status !== 410) throw new Error(`Expected 410, got ${res7.status}`);
    console.log('   Expiration check success');

    console.log('Verification Passed!');
}

test().catch(e => {
    console.error(e);
    process.exit(1);
});
