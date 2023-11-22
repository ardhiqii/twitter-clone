import { BuiltInProviderType } from 'next-auth/providers/index'
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'


const LoginPage: React.FC<LoginPageProps> = ({providers}) => {  
  const {data,status} = useSession()
  const router = useRouter()
  if(status === 'loading'){
    return ''
  }
  if(data){
    router.push('/')
  }


  const loginHandler = async (providerId:string) =>{
    await signIn(providerId)
  }
  return (
    <div className='flex justify-center items-center h-screen' >
      {providers && Object.values(providers).map(provider => (
        <div key={provider.id}>
          <button onClick={loginHandler.bind(this,provider.id)} className='bg-twitterWhite pl-4 pr-5 py-2 text-black rounded-full flex flex-row items-center gap-2'>
            <img src="google.png" alt="" className='h-6' />
            Sign in with {provider.name}</button>
        </div>
      ))}
    </div>
  )
}

export default LoginPage

export const getServerSideProps = async () =>{
  const providers: Record<LiteralUnion<BuiltInProviderType>,ClientSafeProvider> | null = await getProviders()
  return{
    props:{providers}
  }
}


interface LoginPageProps{
  providers: Record<LiteralUnion<BuiltInProviderType>,ClientSafeProvider> | null
}