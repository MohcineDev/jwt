const logoutBtn = document.querySelector('.logout')
async function rr() {

    const tf = await checkJWT()

    if (!tf) {
        location.href = '/login.html'
    }
}

rr()
const aboutSectionQuery = `{
                        user { 
                            campus 
                            email 
                            firstName
                            lastName
                            auditRatio
                            xp:transactions_aggregate(where:{type:{_eq:"xp"}
                            eventId:{_eq:41}}){
                                aggregate{
                                    sum{
                                        amount
                                    }
                                }
                            }
                        
                            failed: audits_aggregate( where: {auditedAt: {_is_null: false} grade:{_lt:1} }){ 
                                aggregate{
                                    count
                                }
                            }
                            succeded: audits_aggregate( where: {auditedAt: {_is_null: false} grade:{_gte:1} }){ 
                                aggregate{
                                    count
                                }
                            }
                            
                            all_audits:audits_aggregate(where:{auditedAt:{_is_null:false}}){
                                aggregate{
                                    count
                                }
                            }
                        }    
`
const projectsXpQuery = ` 
                    transaction(where:{eventId:{_eq:41} type:{_eq:"xp"}}){   
                        path
                        amount
                    } 
`

async function getAboutData() {
    const localJWT = localStorage.getItem('jwt')
    if (!localJWT) {
        return false
    }
    const url = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
    const query = ` 
                          ${aboutSectionQuery}
                          ${projectsXpQuery}
    } `

    try {
        const res = await fetch(url, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${localJWT}`
            },
            body: JSON.stringify({ query })
        })

        const data = await res.json()

        console.log(data);
        listData(data.data)

        if (data.errors) {
            return false
        }
        return true

    } catch (error) {

        console.log(error);
    }
}
getAboutData()

const listData = (data) => {
    let raw = data.user[0]
    document.querySelector('.profile-name').textContent = raw.firstName + " " + raw.lastName
    document.querySelector('.email').textContent = raw.email
    document.querySelector('.campus span').textContent = raw.campus
    document.querySelector('.xp span').textContent = raw.xp.aggregate.sum.amount / 1000
    document.querySelector('.auditRatio  span').textContent = raw.auditRatio.toFixed(1)
    document.querySelector('.audits span').textContent = raw.all_audits.aggregate.count
    document.querySelector('.all_audits span:nth-of-type(1)').textContent = raw.succeded.aggregate.count
    document.querySelector('.all_audits span:nth-of-type(2)').textContent = raw.failed.aggregate.count

    projectXPData(data.transaction)
}

function projectXPData(data) {
    console.log(data);
    let projects = []
    let projectName

    data.forEach(elem => {
        if (elem.path.search("checkpoint") == -1) { 
            projectName = elem.path.split('/')[3]

            if (projectName && projectName.length > 1) {
                elem.amount /= 1000
                elem.path = projectName
                projects.push(elem)
            }

        }
    })
    console.log(projects);
}

// logout
const logoutPopup = document.getElementById('logoutPopup');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

logoutBtn.onclick = () => logoutPopup.style.display = 'block';

cancelBtn.addEventListener('click', () => logoutPopup.style.display = 'none');

confirmBtn.addEventListener('click', () => {
    alert("Goodbye! Hope to see you soon! 👋");
    logoutPopup.style.display = 'none';
    localStorage.removeItem('jwt')
    location.href = '/login.html'
});
