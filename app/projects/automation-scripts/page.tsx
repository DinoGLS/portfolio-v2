import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "AUTOMATISATION · SCRIPTS", en: "AUTOMATION · SCRIPTS" },
  title: { fr: "USB Toolkit", en: "USB Toolkit" },
  subtitle: {
    fr: "USB Toolkit : suite PowerShell/Python, interface WPF, rapport HTML système, portable sur clé USB.",
    en: "USB Toolkit: PowerShell/Python suite, WPF interface, HTML system report, portable on USB drive."
  },
  status: { fr: "Terminé", en: "Done" },
  img: "/projects/usb-toolkit/automat.png",
  badges: [
    { label: "PowerShell" },
    { label: "Python" },
    { label: "WPF" },
  ],
  breadcrumb: "garlens — portfolio/projets/usb-toolkit",
  files: [
    { name: "usb-toolkit", icon: "▾", indent: 0, kind: "folder" },
    { name: "README.md", icon: "≡", indent: 1, kind: "active" },
    { name: "Menu.ps1", icon: "⌘", indent: 1 },
    { name: "SystemReport.ps1", icon: "⌘", indent: 1 },
    { name: "buil.ps1", icon: "⌘", indent: 1 },
    { name: "Menu.xaml", icon: "≡", indent: 1 },
    { name: "automat.png", icon: "▣", indent: 1 },
  ],
  tabs: ["Menu.ps1", "SystemReport.ps1"],
  steps: [
    {
      num: "01",
      title: { fr: "Interface WPF", en: "WPF Interface" },
      subtitle: { fr: "Menu.ps1", en: "Menu.ps1" },
      desc: {
        fr: "Création d'une interface graphique moderne en WPF chargée dynamiquement depuis PowerShell.",
        en: "Creation of a modern graphical interface in WPF dynamically loaded from PowerShell."
      },
      lang: "powershell",
      code: "[xml]$XAML = Get-Content 'Menu.xaml'\n$reader = (New-Object System.Xml.XmlNodeReader $xaml)\n$Window = [Windows.Markup.XamlReader]::Load($reader)\n$Window.ShowDialog()"
    },
    {
      num: "02",
      title: { fr: "Collecte système", en: "System Collection" },
      subtitle: { fr: "WMI & CIM cmdlets", en: "WMI & CIM cmdlets" },
      desc: {
        fr: "Récupération des informations matérielles et logicielles du système via des requêtes WMI/CIM en PowerShell.",
        en: "Retrieval of hardware and software system information via WMI/CIM queries in PowerShell."
      },
      lang: "powershell",
      code: "$cpu = Get-CimInstance Win32_Processor\n$ram = Get-CimInstance Win32_PhysicalMemory\n$os = Get-CimInstance Win32_OperatingSystem"
    },
    {
      num: "03",
      title: { fr: "Génération rapport HTML", en: "HTML Report Generation" },
      subtitle: { fr: "Mise en forme des données", en: "Data formatting" },
      desc: {
        fr: "Transformation des objets collectés en un rapport HTML clair et stylisé avec des balises de style intégrées.",
        en: "Transformation of collected objects into a clear and styled HTML report with inline styling tags."
      },
      lang: "powershell",
      code: "$html = $data | ConvertTo-Html -Fragment -PreContent '<h2>System Info</h2>'\n$html | Out-File 'report.html'"
    },
    {
      num: "04",
      title: { fr: "Conversion PDF", en: "PDF Conversion" },
      subtitle: { fr: "Pandoc", en: "Pandoc" },
      desc: {
        fr: "Utilisation de Pandoc pour convertir les fichiers Markdown en rapports PDF distribuables.",
        en: "Use of Pandoc to convert Markdown files into distributable PDF reports."
      },
      lang: "bash",
      code: "pandoc report.md -o report.pdf --pdf-engine=weasyprint"
    }
  ]
};

export default function AutomationScriptsPage() {
  return <BlueprintProject variant="ide" data={data} />;
}
