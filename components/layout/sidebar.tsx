"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  Users,
  Package,
  Warehouse,
  Cloud,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  Building2,
  ShoppingCart,
  FileText,
  Boxes,
  Truck
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'CRM', 
    href: '/crm', 
    icon: Users,
    children: [
      { name: 'Customers', href: '/crm' }
    ]
  },
  { 
    name: 'ERP', 
    href: '/erp', 
    icon: Building2,
    children: [
      { name: 'Overview', href: '/erp' },
      { name: 'Products', href: '/erp/products' },
      { name: 'Orders', href: '/erp/orders' },
      { name: 'Invoices', href: '/erp/invoices' }
    ]
  },
  { 
    name: 'Warehouse', 
    href: '/warehouse', 
    icon: Warehouse,
    children: [
      { name: 'Overview', href: '/warehouse' },
      { name: 'Inventory', href: '/warehouse/inventory' },
      { name: 'Shipments', href: '/warehouse/shipments' }
    ]
  },
  { name: 'Cloud', href: '/cloud', icon: Cloud },
  { name: 'Network', href: '/network', icon: Activity },
  { name: 'Security', href: '/security', icon: Shield }
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['ERP', 'Warehouse'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const getIcon = (name: string) => {
    switch (name) {
      case 'Products': return Package
      case 'Orders': return ShoppingCart
      case 'Invoices': return FileText
      case 'Inventory': return Boxes
      case 'Shipments': return Truck
      default: return LayoutDashboard
    }
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cloud className="size-5" />
            </div>
            <span className="font-semibold text-foreground">CWMS</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex w-full justify-center">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cloud className="size-5" />
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const expanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                {collapsed ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="size-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col gap-1">
                      <span className="font-medium">{item.name}</span>
                      {hasChildren && (
                        <div className="flex flex-col gap-1 pt-1 text-xs text-muted-foreground">
                          {item.children?.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="hover:text-foreground"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronRight
                          className={cn(
                            "size-4 transition-transform",
                            expanded && "rotate-90"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}

                    {hasChildren && expanded && (
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-4">
                        {item.children?.map(child => {
                          const ChildIcon = getIcon(child.name)
                          const childActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors",
                                childActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <ChildIcon className="size-4" />
                              <span>{child.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("w-full", collapsed && "px-0")}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
