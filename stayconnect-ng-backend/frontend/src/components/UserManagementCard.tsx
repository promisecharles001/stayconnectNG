import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { PlatformUser } from '../types/admin.types';

interface UserManagementCardProps {
  user: PlatformUser;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
  isProcessing?: boolean;
}

const UserManagementCard: React.FC<UserManagementCardProps> = ({
  user,
  onSuspend,
  onActivate,
  isProcessing = false,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '#FF3B30';
      case 'HOST':
        return '#007AFF';
      case 'GUEST':
        return '#34C759';
      default:
        return '#999';
    }
  };

  const getStatusColor = (status: string): string => {
    return status === 'ACTIVE' ? '#34C759' : '#FF3B30';
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSuspend = () => {
    Alert.alert(
      'Suspend User',
      `Are you sure you want to suspend ${fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: () => onSuspend(user.id),
        },
      ]
    );
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Avatar and Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: getRoleColor(user.role) + '20' },
              ]}
            >
              <Text style={[styles.badgeText, { color: getRoleColor(user.role) }]}>
                {user.role}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(user.status) + '20' },
              ]}
            >
              <Text style={[styles.badgeText, { color: getStatusColor(user.status) }]}>
                {user.status}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Join Date */}
      <Text style={styles.date}>Joined: {formatDate(user.createdAt)}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        {user.status === 'ACTIVE' ? (
          <TouchableOpacity
            style={[styles.button, styles.suspendButton]}
            onPress={handleSuspend}
            disabled={isProcessing}
          >
            <Text style={styles.suspendButtonText}>🚫 Suspend User</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.activateButton]}
            onPress={() => onActivate(user.id)}
            disabled={isProcessing}
          >
            <Text style={styles.activateButtonText}>✓ Activate User</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  suspendButton: {
    backgroundColor: '#FF3B30',
  },
  suspendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activateButton: {
    backgroundColor: '#34C759',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserManagementCard;
