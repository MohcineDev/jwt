const user_email = document.querySelector('input[type="text"]')
const pass = window.document.querySelector('input[type="password"]')
const loginBtn = document.querySelector('.login-btn')

async function rr() {

    const tf = await checkJWT()

    if (tf) {
        location.href = '/profile.html'

    }
}

rr()

loginBtn.onclick = async () => {
    const data = user_email.value + ':' + pass.value
    console.log(btoa(data));


    const url = 'https://learn.zone01oujda.ma/api/auth/signin'
    try {
        const res = await fetch(url, {

            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(data)}`,
                'Content-Type': 'application/json'
            }
        })

        const jwt = await res.json()
        if (!res.ok) {
            throw (jwt);
        }

        localStorage.setItem('jwt', jwt)
        setTimeout(() => {
            location.href = '/profile.html'
        }, 200);
    } catch (error) {
        alert(error.error)
        console.log(error.error);
    }

}

