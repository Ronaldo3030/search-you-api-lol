const apiKey = 'RGAPI-1d493604-a50d-464f-a300-dab5ad69c938'

// TRAZ A ULTIMA VERSÃO DO JOGO
let version
window.onload = () => {
    const url = `https://ddragon.leagueoflegends.com/api/versions.json`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            version = data[0]
        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

const modalLoading = document.getElementById('modal-loading')
let person
let dataPartidas
function procurar(id) {
    console.log(version)
    modalLoading.classList.remove('d-none')
    let nickName = document.getElementById(id)
    // AJUSTAR LOCAL DE INSERIR O NICK
    let topSearch = document.getElementById('top-search')
    let normalSearch = document.getElementById('normal-search')
    topSearch.classList.remove('d-none')
    normalSearch.classList.add('d-none')

    searchUserNick(nickName.value.trim().toLowerCase())
    console.log(nickName.value.trim().toLowerCase())

    setTimeout(() => {
        searchMatchs(person.puuId)
    }, 2000)
    setTimeout(() => {
        modalLoading.classList.add('d-none')
    }, 4000)
}

// JA PROCURA DIRETO O MEU
// searchMatchs('_EpgHQi6vNwwsl4oXaptdkBPihse9sdydDVsmBu8aLj9cvJ-vC6dp4niUWC0C3j2rr1wOQMExRsWZA')


// FAZ A REQUISIÇÃO NA API SUMMONER(INVOCADOR) PELO NOME DO PLAYER
// TRAZ ALGUNS DADOS DO USUARIO COMO ID, ACCOUNT ID, PUUID, NAME
function searchUserNick(name) {
    const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            person = new User(data.accountId, data.id, data.name, data.profileIconId, data.puuid, data.summonerLevel)
        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

// FAZ A REQUISIÇÃO NA API SUMMONER(INVOCADOR) PELO PUUID
// TRAZ ALGUNS DADOS DO USUARIO COMO ID, ACCOUNT ID, PUUID, NAME
function searchUserPuuId(puuId) {
    const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuId}?api_key=${apiKey}`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            person = new User(data.accountId, data.id, data.name, data.profileIconId, data.puuid, data.summonerLevel)
        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

// FAZ A REQUISIÇÃO NA API MATCH PELO PUUID
// TRAZ A ID DAS PARTIDAS
function searchMatchs(puuId) {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=20&api_key=${apiKey}`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            searchMatch(data[1])
            // PROCURAR TODAS
            // data.forEach(partida => {
            //     // NUMERO DAS PARTIDAS (MATCH IDs)
            //     searchMatch(partida)
            // })

        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

let participantUser
// FAZ REQUISIÇÃO NA API MATCH PELO ID DA PARTIDA
// TRAZ INFORMAÇÕES SOBRE A PARTIDA
function searchMatch(matchId) {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            // PARTIDAS
            telaPartidas.classList.remove('d-none')

            // VERIFICAÇÃO DE QUEM É O JOGADOR
            let participants = data.info.participants
            participants.forEach(participant => {
                if (participant.puuid == person.puuId)
                    participantUser = participant
            })

            // NOME DO INVOCADOR
            nomeInvocador.innerText = participantUser.summonerName

            console.log(participantUser)
            // TIPO DE PARTIDA
            tipoDePartida.innerText = data.info.gameMode

            // VERIFICAÇÃO DE VITORIA OU DERROTA
            if (data.info.teams[0].win) {
                vitoria.classList.remove('d-none')
                derrota.classList.add('d-none')
            } else {
                vitoria.classList.add('d-none')
                derrota.classList.remove('d-none')
            }

            // ABATES TOTAL NA PARTIDA
            abatesPartida.innerText = data.info.teams[0].objectives.champion.kills + ' - ' + data.info.teams[1].objectives.champion.kills

            // NOME DO CAMPEÃO DO USUARIO
            nomeCampeaoUser.innerText = participantUser.championName

            // IMAGEM DO CAMPEÃO DO USUARIO
            let urlImageChampion = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participantUser.championName}.png`
            imgCampeaoUser.src = urlImageChampion
            summoners()

        }).catch(err => {
            nomeInvocador.innerText = "Jogador não existente"
            telaPartidas.classList.add('d-none')
        })
}

// TEMPORARIO
let telaPartidas = document.querySelector('.partidas')
let nomeInvocador = document.querySelector('.nome-invocador')
let tipoDePartida = document.querySelector('.tipo-de-partida')
let vitoria = document.querySelector('.vitoria')
let derrota = document.querySelector('.derrota')
let abatesPartida = document.querySelector('.abates-partida')
let nomeCampeaoUser = document.querySelector('.nome-campeao-user')
let imgCampeaoUser = document.querySelector('.img-campeao-user')
let magiaUser1 = document.querySelector('.magia-user1')
let magiaUser2 = document.querySelector('.magia-user2')
let runaUser1 = document.querySelector('.runa-user1')
let runaUser2 = document.querySelector('.runa-user2')
let kills = document.querySelector('.kills')
let deaths = document.querySelector('.deaths')
let assists = document.querySelector('.assists')
let melhorPlay = document.querySelector('.melhor-play')

// FAZ REQUISIÇÃO NO JSON DE FEITIÇOS DO LOL
function summoners() {
    const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            // TRANSFORMA O RESULTADO DE DATA.DATA EM UM ARRAY
            let summ = Object.values(data.data)
            summ.forEach(item => {
                if (participantUser.summoner1Id == item.key) {
                    magiaUser1.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.id}.png`
                } else if (participantUser.summoner2Id == item.key) {
                    magiaUser2.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.id}.png`
                }
            })

        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

function spells() {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            // TRANSFORMA O RESULTADO DE DATA.DATA EM UM ARRAY
            let summ = Object.values(data.data)
            summ.forEach(item => {
                if (participantUser.summoner1Id == item.key) {
                    magiaUser1.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.id}.png`
                } else if (participantUser.summoner2Id == item.key) {
                    magiaUser2.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.id}.png`
                }
            })

        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

// FAZ REQUISIÇÃO NO JSON DE ICONES DE CAMPEÕES
function imageChampion(champion) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`
    fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
        }).catch(err => {
            console.log("ERRO: " + err)
        })
}

function User(accId, sumId, nickUser, profileIconId, puuId, level) {
    this.accId = accId
    this.sumId = sumId
    this.nickUser = nickUser
    this.profileIconId = profileIconId
    this.puuId = puuId
    this.level = level
}