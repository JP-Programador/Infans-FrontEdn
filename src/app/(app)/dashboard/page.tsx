import { PageHeader } from "@/components/shared/page-header"
import { DashboardView } from "@/modules/dashboard/components/dashboard-view"

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral das suas escolas." />
      <DashboardView />
    </div>
  )
}
