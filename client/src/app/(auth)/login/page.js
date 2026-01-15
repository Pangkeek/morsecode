import React from "react";

function LoginPage() {
  return (
    <div className="w-full max-w-[705px]">
        <h1 className="text-center">morsecode</h1>
        <div
        className="
        max-w-[705px]
        min-h-[650px]
        bg-[#1E2332]
        rounded-2xl
        flex
        flex-col
        items-center
        justify-center"
        >
        <p>
            login
        </p>
        <div className="flex flex-col">
            <label>username</label>
            <input className='w-[540px] h-[80px] bg-[#2A3247] rounded-2xl'/>
        </div>
        <div className="flex flex-col">
            <label>password</label>
            <input className='w-[540px] h-[80px] bg-[#2A3247] rounded-2xl'/>
        </div>
        <button className="w-[280px] h-[80px] bg-[#EF4444] rounded-2xl mt-4">
            Login
        </button>
        <p>Don&apos;t have an account?</p>
        <a>Register</a>
        </div>

    </div>
  );
}

export default LoginPage;
