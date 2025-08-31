import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';


function SignOut() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <button
            onClick={handleSignOut}
            className='mb-4 p-3 ml-2 w-36 rounded-md text-white font-medium bg-gradient-to-r from-zinc-300 to-zinc-300 hover:from-zinc-500 hover:to-zinc-500 transition-all duration-500 cursor-pointer'>Sign Out</button>
    );
}

export default SignOut;

