// @/components/Icon/index.tsx
import React from 'react';
import * as FeatherIcons from 'react-native-feather';

export interface IconProps {
  name: 'home' | 'home-filled' | 'list' | 'list-search' | 'plus' | 'bell' | 'users' | 'user' | 
        'trending-up' | 'trending-down' | 'bar-chart' | 'mail' | 'phone' | 'calendar' | 
        'dollar-sign' | 'receipt' | 'wallet' | 'coins' | 'close' | 'alert-circle' | 'checkmark-circle' | 'clock' | 
        'help-circle' | 'minus' | 'brief-case' | 'brief-case-filled' | 'check-circle' | 'x' | 'credit-card' |
        'lock' | 'chevron-right' | 'log-out' | 'message-circle';
  size?: number;
  color?: string;
}

// Mapping from our semantic names to Feather icon components
const iconMap = {
  'home': FeatherIcons.Home,
  'home-filled': FeatherIcons.Home, // Feather doesn't have filled variants, using same icon
  'list': FeatherIcons.List,
  'list-search': FeatherIcons.Search,
  'plus': FeatherIcons.Plus,
  'bell': FeatherIcons.Bell,
  'users': FeatherIcons.Users,
  'user': FeatherIcons.User,
  'trending-up': FeatherIcons.TrendingUp,
  'trending-down': FeatherIcons.TrendingDown,
  'bar-chart': FeatherIcons.BarChart,
  'mail': FeatherIcons.Mail,
  'phone': FeatherIcons.Phone,
  'calendar': FeatherIcons.Calendar,
  'dollar-sign': FeatherIcons.DollarSign,
  'receipt': FeatherIcons.FileText, // Using FileText as closest alternative to Receipt
  'wallet': FeatherIcons.CreditCard, // Using CreditCard as closest alternative to Wallet
  'coins': FeatherIcons.DollarSign, // Using DollarSign as closest alternative
  'close': FeatherIcons.X,
  'alert-circle': FeatherIcons.AlertCircle,
  'checkmark-circle': FeatherIcons.CheckCircle,
  'check-circle': FeatherIcons.CheckCircle,
  'clock': FeatherIcons.Clock,
  'help-circle': FeatherIcons.HelpCircle,
  'minus': FeatherIcons.Minus,
  'brief-case': FeatherIcons.Briefcase,
  'brief-case-filled': FeatherIcons.Briefcase,
  'x': FeatherIcons.X,
  'credit-card': FeatherIcons.CreditCard,
  'lock': FeatherIcons.Lock,
  'chevron-right': FeatherIcons.ChevronRight,
  'log-out': FeatherIcons.LogOut,
  'message-circle': FeatherIcons.MessageCircle,
};

export default function Icon({ name, size = 24, color = '#000', ...props }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent width={size} height={size} stroke={color} {...props} />;
}