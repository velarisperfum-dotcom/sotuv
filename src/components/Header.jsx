import React from 'react';
import { 
  LogOut, Smartphone, User, Shield, 
  ArrowLeftRight, CheckCircle2, Building2
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  currentRole,
  onLogout,
  onOpenPwaModal,
  balances
}) {
  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  const roleLabels = {
    director: { name: 'Direktor Kabineti', badge: 'Bosh Boshqaruv', color: '#f59e0b', avatar: '👑' },
    accountant: { name: 'Buxgalteriya & Moliya', badge: 'Moliya & To\'lov', color: '#10b981', avatar: '📊' },
    warehouse: { name: 'Sklad & Logistika', badge: 'Ombor Boshqaruvi', color: '#2563eb', avatar: '📦' },
    seller_mobile: { name: 'Mobil Sotuvchi Profili', badge: 'Agent / APK', color: '#ec4899', avatar: '📱' },
  };

  const roleInfo = roleLabels[currentRole] || roleLabels.director;

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)'
    }}>
      {/* Left: Active Role & System Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `${roleInfo.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {roleInfo.avatar}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              {roleInfo.name}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: roleInfo.color,
              background: `${roleInfo.color}15`,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {roleInfo.badge}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Foydalanuvchi: <strong>{currentUser?.name || 'Xodim'}</strong> ({currentUser?.position || 'Xodim'})
          </div>
        </div>
      </div>

      {/* Right: Quick Balances, APK button & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Balances (Faqat Direktor va Buxgalter uchun) */}
        {(currentRole === 'director' || currentRole === 'accountant') && (
          <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748b' }}>Kassa: </span>
              <strong style={{ color: '#16a34a' }}>{formatMoney(balances?.cash || 0)}</strong>
            </div>
            <div style={{ color: '#cbd5e1' }}>|</div>
            <div>
              <span style={{ color: '#64748b' }}>Bank: </span>
              <strong style={{ color: '#2563eb' }}>{formatMoney(balances?.bank || 0)}</strong>
            </div>
          </div>
        )}

        {/* APK Button */}
        <button
          onClick={onOpenPwaModal}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Telefonga ilovani o'rnatish"
        >
          <Smartphone size={14} style={{ color: '#ec4899' }} /> APK O'rnatish
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '10px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Tizimdan chiqish va boshqa hisobga kirish"
        >
          <LogOut size={14} /> Chiqish
        </button>
      </div>
    </header>
  );
}
