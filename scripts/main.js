let root =''

if (location.hostname === 'mohcinedev.github.io') {
    root = '/jwt'
}

async function checkJWT() {

    const localJWT = localStorage.getItem('jwt')
    if (!localJWT) {
        return false
    }

    const url = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
    const query = `    {  user { login   }  }`

    try {
        const res = await fetch(url, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${localJWT}`
            },
            body: JSON.stringify({ query })
        })

        const jwt = await res.json() 
      

        if (jwt.errors) {
            return false
        } 
        
        return true

    } catch (error) {

        console.log(error);
    }
} 
 