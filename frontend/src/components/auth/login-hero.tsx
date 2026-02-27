import { Building2, Code2, Database, Smartphone, Github } from 'lucide-react'

export function LoginHero() {
    return (
        <div className="hidden lg:flex flex-1 relative bg-linear-to-br from-primary to-primary/80 overflow-y-auto">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center px-12 py-8 text-primary-foreground">

                {/* Brand Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-4">
                        <div className="bg-primary-foreground p-3 rounded-xl">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-primary-foreground">Pharmaciano ERP</h1>
                    {/* <p className="text-primary-foreground/80 mt-2">Pharmacy Management System</p> */}
                </div>

                {/* Features Section */}
                <div className="max-w-lg mb-12">
                    <h2 className="text-lg font-bold mb-4 leading-snug">
                        Powerful Pharmacy ERP Platform:
                    </h2>

                    <p className="text-base text-primary-foreground/80 mb-6 leading-relaxed">
                        Enterprise-grade ERP with advanced RBAC + PBAC security,
                        AI-driven reporting, demand forecasting, and complete
                        pharmacy lifecycle management.
                    </p>

                    <div className="space-y-3 text-sm">
                        {[
                            "Advanced RBAC + PBAC access control system",
                            "AI-based reporting & demand forecasting",
                            "Smart stock recommendation engine",
                            "Real-time inventory & expiry tracking",
                            "Multi-branch centralized management",
                            "Sales, accounting & supplier management"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 mt-2 bg-primary-foreground/60 rounded-full"></div>
                                <span className="text-primary-foreground/85">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="max-w-3xl">

                    <div className="flex flex-wrap justify-center items-center gap-4">

                        <h3 className="text-lg font-semibold ">Team:</h3>
                        {/* Frontend */}
                        <a
                            href="https://github.com/ShowravKormokar/Pharmaciano"
                            target="_blank"
                            title='Frontend Dev.'
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
                        >
                            <Code2 className="h-4 w-4" />
                            <span>Showrav</span>
                            <span className="text-xs opacity-60">FE</span>
                            <Github className="h-3 w-3 opacity-70" />
                        </a>

                        {/* Backend */}
                        <a
                            href="https://github.com/sohelrana2002/Pharmaciano"
                            target="_blank"
                            title='Backend Dev.'
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
                        >
                            <Database className="h-4 w-4" />
                            <span>Sohel</span>
                            <span className="text-xs opacity-60">BE</span>
                            <Github className="h-3 w-3 opacity-70" />
                        </a>

                        {/* Mobile */}
                        <a
                            href="https://github.com/rafiz001"
                            target="_blank"
                            title='App Dev.'
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm"
                        >
                            <Smartphone className="h-4 w-4" />
                            <span>Rafiz</span>
                            <span className="text-xs opacity-60">Mobile</span>
                            <Github className="h-3 w-3 opacity-70" />
                        </a>

                    </div>
                </div>
                <p className="text-center text-sm text-primary-foreground/70 mt-4">
                    Supervised by — <a href='https://vu.edu.bd/profile/02443/mohammad-faisal-al-naser' rel="noopener noreferrer" target="_blank" className='underline'>Mohammad Faisal Al Naser</a> [Lecturer]<br />
                    Developed as a final year project at <a href='https://vu.edu.bd/' target="_blank" rel="noopener noreferrer" className='underline'>Varendra University</a>.
                </p>
            </div>
        </div>
    )
};