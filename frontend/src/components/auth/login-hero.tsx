import { Building2, Code2, Database, Smartphone, Github, ShieldCheck, CheckCircle2 } from 'lucide-react'

const FEATURES = [
    "Advanced RBAC + PBAC access control",
    "AI-based reporting & demand forecasting",
    "Smart stock recommendation engine",
    "Real-time inventory & expiry tracking",
    "Multi-branch centralized management",
    "Sales, accounting & supplier management",
]

const TEAM = [
    {
        name: "Showrav",
        role: "Frontend",
        title: "Frontend Developer",
        icon: Code2,
        href: "https://github.com/ShowravKormokar/Pharmaciano",
    },
    {
        name: "Sohel",
        role: "Backend",
        title: "Backend Developer",
        icon: Database, 
        href: "https://github.com/sohelrana2002/Pharmaciano",
    },
    {
        name: "Rafiz",
        role: "Mobile",
        title: "App Developer",
        icon: Smartphone,
        href: "https://github.com/rafiz001/pharmaciano-flutter",
    },
] as const

export function LoginHero() {
    return (
        <div className="hidden lg:flex flex-1 relative bg-linear-to-br from-primary via-primary to-primary/90 overflow-y-auto">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-black/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.06] text-primary-foreground"
                    style={{
                        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
            </div>
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 flex flex-col justify-center w-full px-12 py-8 text-primary-foreground">
                <div className="mx-auto w-full max-w-lg">

                    {/* Brand */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="mb-2 rounded-2xl bg-primary-foreground p-3 shadow-lg shadow-black/10 ring-1 ring-primary-foreground/20">
                            <Building2 className="h-7 w-7 text-primary" strokeWidth={2} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Pharmaciano</h1>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                            Pharmacy Management ERP
                        </p>
                    </div>

                    {/* Value proposition */}
                    <div className="mb-6">
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium ring-1 ring-primary-foreground/15">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Enterprise-grade platform
                        </div>
                        {/* <h2 className="text-xl font-semibold leading-snug mb-2">
                            Run your entire pharmacy from one system
                        </h2> */}
                        <p className="text-sm leading-relaxed text-primary-foreground/75">
                            Advanced access control, AI-driven reporting, demand forecasting,
                            and complete lifecycle management - built for multi-branch
                            pharmacy operations.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-primary-foreground/5 p-4 ring-1 ring-primary-foreground/10">
                        {FEATURES.map((feature) => (
                            <div key={feature} className="flex items-start gap-2.5">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary-foreground/60" strokeWidth={2} />
                                <span className="text-[13px] leading-snug text-primary-foreground/85">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Team */}
                    <div className="mb-6">
                        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                            Built by
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {TEAM.map(({ name, role, title, icon: Icon, href }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={title}
                                    className="group relative flex items-center gap-2.5 rounded-lg bg-primary-foreground/5 px-3 py-2 ring-1 ring-primary-foreground/10 transition hover:bg-primary-foreground/10 hover:ring-primary-foreground/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-foreground/60"
                                >
                                    <span className="relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-foreground/10">
                                        <Icon className="h-4 w-4" />
                                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-2 ring-primary">
                                            <Github className="h-2.5 w-2.5" />
                                        </span>
                                    </span>
                                    <span className="text-left leading-tight">
                                        <span className="block text-[12px] font-medium">{name}</span>
                                        <span className="block text-[10px] text-primary-foreground/60">{role}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-primary-foreground/10 pt-2 text-center">
                        <p className="text-xs leading-relaxed text-primary-foreground/60">
                            Supervised by{" "}
                            <a
                                href="https://vu.edu.bd/profile/02443/mohammad-faisal-al-naser"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary-foreground/80 underline underline-offset-2 hover:text-primary-foreground"
                            >
                                Mohammad Faisal Al Naser
                            </a>
                            , Lecturer[CSE]
                            <br />
                            Final year project at{" "}
                            <a
                                href="https://vu.edu.bd/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary-foreground/80 underline underline-offset-2 hover:text-primary-foreground"
                            >
                                Varendra University
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// import { Building2, Code2, Database, Smartphone, Github } from 'lucide-react'

// export function LoginHero() {
//     return (
//         <div className="hidden lg:flex flex-1 relative bg-linear-to-br from-primary to-primary/80 overflow-y-auto">
//             <div className="absolute inset-0 bg-black/10"></div>
//             <div className="relative z-10 flex flex-col justify-center px-12 py-8 text-primary-foreground">

//                 {/* Brand Section */}
//                 <div className="text-center mb-8">
//                     <div className="flex justify-center items-center mb-4">
//                         <div className="bg-primary-foreground p-3 rounded-xl">
//                             <Building2 className="h-8 w-8 text-primary" />
//                         </div>
//                     </div>
//                     <h1 className="text-3xl font-bold text-primary-foreground">Pharmaciano ERP</h1>
//                     {/* <p className="text-primary-foreground/80 mt-2">Pharmacy Management System</p> */}
//                 </div>

//                 {/* Features Section */}
//                 <div className="max-w-lg mb-12">
//                     <h2 className="text-lg font-bold mb-4 leading-snug">
//                         Powerful Pharmacy ERP Platform:
//                     </h2>

//                     <p className="text-base text-primary-foreground/80 mb-6 leading-snug">
//                         Enterprise-grade ERP with advanced RBAC + PBAC security,
//                         AI-driven reporting, demand forecasting, and complete
//                         pharmacy lifecycle management.
//                     </p>

//                     <div className="space-y-3 text-sm">
//                         {[
//                             "Advanced RBAC + PBAC access control system",
//                             "AI-based reporting & demand forecasting",
//                             "Smart stock recommendation engine",
//                             "Real-time inventory & expiry tracking",
//                             "Multi-branch centralized management",
//                             "Sales, accounting & supplier management"
//                         ].map((feature, index) => (
//                             <div key={index} className="flex items-start gap-3">
//                                 <div className="w-1.5 h-1.5 mt-2 bg-primary-foreground/60 rounded-full"></div>
//                                 <span className="text-primary-foreground/85">{feature}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Team Section */}
//                 <div className="max-w-3xl">

//                     <div className="flex flex-wrap justify-center items-center gap-4">

//                         {/* <h3 className="text-lg font-semibold ">Team:</h3> */}
//                         {/* Frontend */}
//                         {/* <a
//                             href="https://github.com/ShowravKormokar/Pharmaciano"
//                             target="_blank"
//                             title='Frontend Dev.'
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
//                         >
//                             <Code2 className="h-4 w-4" />
//                             <span>Showrav</span>
//                             <span className="text-xs opacity-60">FE</span>
//                             <Github className="h-3 w-3 opacity-70" />
//                         </a> */}

//                         {/* Backend */}
//                         {/* <a
//                             href="https://github.com/sohelrana2002/Pharmaciano"
//                             target="_blank"
//                             title='Backend Dev.'
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
//                         >
//                             <Database className="h-4 w-4" />
//                             <span>Sohel</span>
//                             <span className="text-xs opacity-60">BE</span>
//                             <Github className="h-3 w-3 opacity-70" />
//                         </a> */}

//                         {/* Mobile */}
//                         {/* <a
//                             href="https://github.com/rafiz001"
//                             target="_blank"
//                             title='App Dev.'
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
//                         >
//                             <Smartphone className="h-4 w-4" />
//                             <span>Rafiz</span>
//                             <span className="text-xs opacity-60">Mobile</span>
//                             <Github className="h-3 w-3 opacity-70" />
//                         </a> */}

//                     </div>
//                 </div>
//                 {/* <p className="text-center text-sm text-primary-foreground/70 mt-4">
//                     Supervised by — <a href='https://vu.edu.bd/profile/02443/mohammad-faisal-al-naser' rel="noopener noreferrer" target="_blank" className='underline'>Mohammad Faisal Al Naser</a> [Lecturer]<br />
//                     Developed as a final year project at <a href='https://vu.edu.bd/' target="_blank" rel="noopener noreferrer" className='underline'>Varendra University</a>.
//                 </p> */}
//                 <div className="bg-primary-foreground/5 rounded-lg p-2 mt-6 text-center">
//                     <p className="text-[0.6rem] text-primary-foreground/70">
//                         <span>Version 1.0.0</span>
//                         <span> • </span>
//                         <span>Academic Edition</span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// };