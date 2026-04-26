import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { submitReviewThunk } from '../store/slices/bookingSlice';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Booking } from '../types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function BookingDetailsScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { myBookings } = useSelector((state: RootState) => state.bookings);
  
  // Find booking from Redux state directly — no API call needed
  const booking = myBookings.find(b => b.id === bookingId) ?? null;

  const isActive = booking?.status === 'ACTIVE';
  
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useLayoutEffect(() => {
    if (booking) {
      navigation.setOptions({ title: booking.name });
    }
  }, [booking, navigation]);

  const handleSubmitReview = async () => {
    if (!booking) return;
    setSubmittingReview(true);
    try {
      const resultAction = await dispatch(submitReviewThunk({
        bookingId: booking.id,
        providerId: booking.providerId,
        rating,
        comment,
      }));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        Alert.alert('Success', 'Your review has been submitted!');
        setReviewModalVisible(false);
      } else {
        Alert.alert('Error', resultAction.payload as string || 'Failed to submit review');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!booking) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Booking not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Image source={{ uri: booking.imageUrl }} style={styles.hero} />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{booking.name}</Text>
        <View
          style={[
            styles.badge,
            isActive ? styles.badgeActive : styles.badgeCompleted,
          ]}>
          <Text
            style={[
              styles.badgeText,
              isActive ? styles.badgeTextActive : styles.badgeTextCompleted,
            ]}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow label="Service" value={booking.subtitle} />
        <View style={styles.hairline} />
        <DetailRow label="Booked" value={booking.bookedAt} />
        <View style={styles.hairline} />
        <DetailRow label="Location" value={booking.address} />
        {typeof booking.waitMinutes === 'number' ? (
          <>
            <View style={styles.hairline} />
            <DetailRow
              label="Est. wait"
              value={`~${booking.waitMinutes} min`}
            />
          </>
        ) : null}
        <View style={styles.hairline} />
        <DetailRow label="Reference" value={booking.referenceCode} />
      </View>

      {!isActive && (
        <View style={styles.reviewSection}>
          <Pressable style={styles.reviewBtn} onPress={() => setReviewModalVisible(true)}>
            <Text style={styles.reviewBtnText}>Leave a Review</Text>
          </Pressable>
        </View>
      )}

      {reviewModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.starIcon, { color: star <= rating ? '#f59e0b' : '#d1d5db' }]}>★</Text>
                </Pressable>
              ))}
            </View>
            <Pressable 
              style={[styles.submitReviewBtn, submittingReview && styles.disabledBtn]} 
              onPress={handleSubmitReview}
              disabled={submittingReview}
            >
              <Text style={styles.submitReviewBtnText}>{submittingReview ? 'Submitting...' : 'Submit Review'}</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setReviewModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeTheme.background,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeTheme.background,
    padding: 24,
  },
  missingText: {
    fontSize: 16,
    color: homeTheme.textSecondary,
  },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: homeTheme.border,
    borderBottomLeftRadius: homeSpacing.cardRadius,
    borderBottomRightRadius: homeSpacing.cardRadius,
  },
  titleBlock: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: homeTheme.text,
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeActive: {
    backgroundColor: homeTheme.badgeActiveSoftBg,
  },
  badgeCompleted: {
    backgroundColor: homeTheme.badgeCompletedBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  badgeTextActive: {
    color: homeTheme.badgeActiveSoftText,
  },
  badgeTextCompleted: {
    color: homeTheme.badgeCompletedText,
  },
  card: {
    marginHorizontal: homeSpacing.screenHorizontal,
    marginTop: 12,
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    gap: 6,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: homeTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: homeTheme.text,
    lineHeight: 22,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: homeTheme.border,
    marginVertical: 14,
  },
  reviewSection: {
    marginTop: 20,
    paddingHorizontal: homeSpacing.screenHorizontal,
  },
  reviewBtn: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34d399',
  },
  reviewBtnText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  starIcon: {
    fontSize: 40,
  },
  submitReviewBtn: {
    backgroundColor: homeTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitReviewBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  cancelBtn: {
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
