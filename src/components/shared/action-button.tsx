'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LucideIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  Minus
} from 'lucide-react'

export interface ActionButtonProps {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  status?: 'success' | 'warning' | 'error' | 'pending' | 'idle'
  badge?: string | number
  className?: string
  tooltip?: string
}

const statusIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  pending: Clock,
  idle: Play
}

const statusColors = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  pending: 'text-blue-600',
  idle: 'text-gray-600'
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  icon: Icon,
  status,
  badge,
  className = '',
  tooltip
}) => {
  const StatusIcon = status ? statusIcons[status] : null
  const statusColor = status ? statusColors[status] : ''

  const buttonContent = (
    <div className="flex items-center gap-2">
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : StatusIcon ? (
        <StatusIcon className={`h-4 w-4 ${statusColor}`} />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      
      <span>{label}</span>
      
      {badge && (
        <Badge variant="secondary" className="ml-1">
          {badge}
        </Badge>
      )}
    </div>
  )

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      title={tooltip}
    >
      {buttonContent}
    </Button>
  )
}

// Predefined action buttons for common use cases
export const SaveButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon'>> = (props) => (
  <ActionButton
    {...props}
    label="Save"
    icon={CheckCircle}
  />
)

export const CancelButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Cancel"
    icon={XCircle}
    variant="outline"
  />
)

export const EditButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Edit"
    icon={Edit}
    variant="outline"
  />
)

export const DeleteButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Delete"
    icon={Trash2}
    variant="destructive"
  />
)

export const ViewButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="View"
    icon={Eye}
    variant="outline"
  />
)

export const AddButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon'>> = (props) => (
  <ActionButton
    {...props}
    label="Add"
    icon={Plus}
  />
)

export const RemoveButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Remove"
    icon={Minus}
    variant="outline"
  />
)

export const DownloadButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Download"
    icon={Download}
    variant="outline"
  />
)

export const UploadButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Upload"
    icon={Upload}
    variant="outline"
  />
)

export const RefreshButton: React.FC<Omit<ActionButtonProps, 'label' | 'icon' | 'variant'>> = (props) => (
  <ActionButton
    {...props}
    label="Refresh"
    icon={RefreshCw}
    variant="outline"
  />
)

export default ActionButton
