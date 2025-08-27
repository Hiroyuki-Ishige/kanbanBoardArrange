import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';


function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const signUp = async () => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert('Your email and password have been registered! Check your email for confirmation!');
    };

    const signIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
        } else {
            navigate('/kanban');
            alert('You have successfully signed in!');
        }
    };

    return (
        <div className='p-6 w-full min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-900 flex items-center justify-center'>
            <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden flex-col items-center justify-center p-6">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
                    className='mb-4 flex-grow bg-zinc-500 rounded-md p-3 w-full text-white' />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
                    className='mb-4 flex-grow bg-zinc-500 rounded-md p-3 w-full text-white' />
                <button onClick={signUp}
                    className='mb-4 p-3 ml-2 w-36 rounded-md text-white font-medium bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-500 hover:to-blue-500 transition-all duration-500 cursor-pointer'>Register</button>
                <button onClick={signIn}
                    className='mb-4 p-3 ml-2 w-36 rounded-md text-white font-medium bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-500 hover:to-amber-500 transition-all duration-500 cursor-pointer'>Sign In</button>
            </div>
        </div>
    );
}

export default Auth;

