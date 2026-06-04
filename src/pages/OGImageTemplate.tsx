export default function OGImageTemplate() {
  return (
    // https://images.unsplash.com/photo-1559239115-ce3eb7cb87ea?q=80&w=1088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
    <div className="w-[1200px] h-[630px] flex flex-col justify-center bg-slate-50 relative overflow-hidden font-sans p-24 bg-[url('https://images.unsplash.com/photo-1559239115-ce3eb7cb87ea?q=80&w=1600')] bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-50">
      {/* Abstract Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-200/40 blur-[100px] rounded-full" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-indigo-100 shadow-sm mb-12">
          <img
            src="./icon.svg"
            alt="Genaul Logo"
            width="24"
            height="24"
            className="text-white w-6 h-6 color-white"
          />
          <span className="text-2xl font-bold text-indigo-950 tracking-wide">
            Genaul
          </span>
        </div>

        <h1 className="text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
          Your Private <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-indigo-500 to-blue-500">
            Workspace.
          </span>
        </h1>

        <p className="max-w-3xl text-4xl text-slate-500 font-medium leading-relaxed">
          Organize your mind with a lightning fast, local-first markdown
          workspace.
        </p>
      </div>
    </div>
  );
}
