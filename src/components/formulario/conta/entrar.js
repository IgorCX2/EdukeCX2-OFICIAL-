"use client";
require('dotenv').config();
import Link from "next/link";
import dynamic from 'next/dynamic'
import { useState } from "react"
import { Envs } from "src/utils/configEnv"
import { useRouter } from 'next/navigation'
import { encryptData } from "script/criptografarDados"
import { cookieAction } from 'src/app/action';
import InputFunction from "../inputForms";
import Btn from "@/components/botoes/btn";
const FormContaVerificar = dynamic(() => import('./verificar'));
import TelaCarregando from "@/components/carregando/telacarregando";
async function postEntrar(formEntrar) {
    try {
        const apiEntrar = await fetch(`${Envs.API_LOCAL}api/contaRegistro/entrar`, {
            method: 'POST',
            body: JSON.stringify({ dados: formEntrar }),
            headers: { 'Content-Type': 'application/json', }
        });
        return apiEntrar.json()
    } catch (error) {
        return error
    }
}
export default function FormContaEntrar({modal}) {
    const router = useRouter();
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [statusVerificador, setStatusVerificadores] = useState(false)
    const [verSenha, setVerSenha] = useState(false)
    const [response, setResponse] = useState({
        id: '',
        msg: '',
        status: ''
    })
    const [formDados, setFormDados] = useState({
        email: '',
        senha: ''
    })
    const SendEntrar = async e => {
        e.preventDefault()
        setLoadingStatus(true)
        if (formDados.email) {
            if (formDados.senha.length >= 6) {
                const segurancaReserva = encryptData(JSON.stringify(formDados), Envs.CHAVE_CODIFICADORA)
                const responseEnv = await postEntrar(segurancaReserva)
                if (responseEnv.status == 200) {
                    const cadCookie = await cookieAction('cadastrar', 'UserToken', responseEnv.token, 60*100)
                    return router.push('/aprender')
                } else {
                    setResponse({
                        id: responseEnv.id,
                        status: responseEnv.status,
                        msg: responseEnv.msg
                    });
                }
                if (responseEnv.status == 'verificar') {
                    setStatusVerificadores(true)
                }
            } else {
                setResponse({ msg: "Obs: a senha deve ser maior que 6 digitos", status: '' })
            }
        } else {
            setResponse({ msg: 'Você deve preencher todos os campos!', status: '' })
        }
        setLoadingStatus(false)
    }
    const onChangeInput = e => setFormDados({ ...formDados, [e.target.name]: e.target.value })
    return (
        <div>
            {!statusVerificador ?
                <form className='gap-4 flex flex-col mt-5 w-full' onSubmit={SendEntrar}>
                    <InputFunction
                        value={formDados.email}
                        onChange={onChangeInput}
                        nome={'email'}
                        tipo={'email'}
                        estilo={''}
                        completar={'email'}
                        placeholder={'Email'}
                    />
                    <div className="flex gap-2">
                        <InputFunction
                            value={formDados.senha}
                            onChange={onChangeInput}
                            nome={'senha'}
                            tipo={verSenha == false ? "password" : "text"}
                            estilo={''}
                            completar={'new-password'}
                            placeholder={'Senha'}
                        />
                        <div className="border rounded-lg p-2 py-3 mb-2 select-none" onClick={() => setVerSenha(!verSenha)}>MOSTRAR</div>
                    </div>
                    <Link href="/conta/cadastrar">não tenho um cadastro. <u>Fazer Cadastro</u></Link>
                    <Btn configuracao={'bg-gradient-to-r from-bluelight to-blue-500 text-white hover:from-blue-500 hover:to-blue-500'}>fazer login</Btn>
                    <Link href="/conta/recuperar">Esqueceu a senha?</Link>
                    <Link href="/conta/entrar"><p>Ao realizar o login, você estará concordando com a nossa <u>política de privacidade e termos.</u></p></Link>
                    {response.msg && <strong>{response.msg}. {response.status && `ERRO:${response.status}`}</strong>}
                    {loadingStatus == true && <TelaCarregando/>}
                </form>
                : 
                <FormContaVerificar id={response.id} modal={modal}/>
            }
        </div>
    )
}