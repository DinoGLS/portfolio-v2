export default function WanCisco() {
  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
          Simulation WAN Cisco avec redondance & supervision
        </h1>

        <p className="text-slate-300 max-w-2xl mb-10">
          Mise en place d’un réseau d’entreprise orienté disponibilité, 
          observabilité réseau et continuité de service. 
          Ce lab simule une architecture WAN avec redondance de routeurs, 
          routage dynamique, supervision et gestion des logs.
        </p>

        {/* Badge */}
        <span className="inline-block mb-10 px-3 py-1 text-sm rounded-md bg-green-600/30 text-green-300 border border-green-500/40">
          Terminé
        </span>

        {/* Schéma */}
        <div className="relative mb-10 border border-slate-700/60 bg-slate-800/60 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Schéma réseau</p>
          <img
            src="/projects/wan-simulation/Configurationwan.png"
            alt="Schéma WAN Cisco"
            className="rounded-lg w-full"
          />
        </div>

        {/* Objectifs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">
            Objectifs du lab
          </h2>

          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Mettre en place un réseau WAN multi‑sites</li>
            <li>• Configurer un routage dynamique (OSPF)</li>
            <li>• Implémenter une redondance de routeurs</li>
            <li>• Assurer la continuité de service en cas de panne</li>
            <li>• Mettre en place une supervision réseau</li>
            <li>• Centraliser les logs et les événements</li>
          </ul>
        </section>

        {/* Architecture */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">
            Architecture réseau
          </h2>

          <p className="text-slate-300 text-sm mb-4">
            L’architecture simule deux sites interconnectés via un backbone WAN, 
            avec redondance des routeurs et routage dynamique.
          </p>

          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• 2 routeurs principaux (R1, R2)</li>
            <li>• 2 routeurs secondaires (R3, R4)</li>
            <li>• 1 backbone WAN simulé</li>
            <li>• VLANs internes pour chaque site</li>
            <li>• Serveur de supervision (Syslog / SNMP)</li>
          </ul>
        </section>

        {/* Configurations clés */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">
            Configurations clés
          </h2>

          <div className="space-y-6">

            {/* OSPF */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Routage dynamique (OSPF)
              </h3>
              <pre className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-lg text-slate-300 text-sm overflow-x-auto">
{`router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
 network 192.168.1.0 0.0.0.255 area 0`}
              </pre>
            </div>

            {/* Redondance */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Redondance & continuité de service
              </h3>
              <p className="text-slate-300 text-sm">
                Mise en place d’un basculement automatique via OSPF : 
                si R1 tombe, R2 prend immédiatement le relais.
              </p>
            </div>

            {/* Supervision */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Supervision & logs
              </h3>
              <pre className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-lg text-slate-300 text-sm overflow-x-auto">
{`logging host 192.168.10.50
snmp-server community public RO`}
              </pre>
            </div>

          </div>
        </section>

        {/* Compétences acquises */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">
            Compétences acquises
          </h2>

          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Routage dynamique (OSPF)</li>
            <li>• Redondance et haute disponibilité</li>
            <li>• Architecture réseau multi‑sites</li>
            <li>• Supervision réseau (SNMP, Syslog)</li>
            <li>• Analyse des logs et observabilité</li>
            <li>• Documentation technique</li>
          </ul>
        </section>

      </div>
    </main>
  );
}
