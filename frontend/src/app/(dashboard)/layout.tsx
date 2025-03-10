import { AppSidebar } from '@/components/Sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/Sidebar/breadcrumb';
import { HeaderActions } from '@/components/ui/Sidebar/header-actions';
import { Separator } from '@/components/ui/Sidebar/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/Sidebar/sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clarifyr | Dashboard',
  description:
    "Take your Business to another level with Clarifyr's AI powered customized Chat Bot!",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-row">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 bg-muted bg-opacity-75 backdrop-blur-lg backdrop-filter transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:bg-custom-darkblue">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 hover:bg-custom-sage/20 dark:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <HeaderActions />
          </header>
          <div className="flex w-full flex-1 flex-col gap-4 bg-muted p-4 pt-0 dark:bg-custom-darkblue">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
