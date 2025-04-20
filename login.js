const user_email = document.querySelector('input[type="text"]')
const pass = window.document.querySelector('input[type="password"]')
const form = document.querySelector('form')

async function rr() {

    const tf = await checkJWT()

    if (tf) {
        location.pathname = '/jwt/profile.html'
    }
}

rr()

form.onsubmit = async (e) => {
    //prevent page reload ==+> access profile page
    e.preventDefault()
    
    const data = user_email.value + ':' + pass.value

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
        console.log("error");
        if (!res.ok) {

            throw (jwt);
        }

        localStorage.setItem('jwt', jwt)
        setTimeout(() => {
            location.pathname = '/jwt/profile.html'
        }, 200);
    } catch (error) {
        alert(error.error)
        console.log(error.error);
    }

}

