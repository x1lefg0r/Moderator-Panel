import { useParams } from "react-router-dom";
import { fetchAdById } from "../api/ads.ts";
import { ImageGallery } from "../components/ui/ImageGallery.tsx";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ModerationModal } from "../components/modal/ModerationModal.tsx";
import { ModerationHistory } from "../components/moderation/ModerationHistory.tsx";
import { ModerationActions } from "../components/moderation/ModerationActions.tsx";
import { SellerCard } from "../components/seller/SellerCard.tsx";
import { AdDetails } from "../components/ads/AdDetails.tsx";
import { AdNavigation } from "../components/navigation/AdNavigation.tsx";
import { Toaster } from "react-hot-toast";
import { LoadingState } from "../components/ui/LoadingState.tsx";
import { ErrorState } from "../components/ui/ErrorState.tsx";
import {
  AdDetailsSkeleton,
  ImageGallerySkeleton,
  SellerCardSkeleton,
} from "../components/ads/AdDetailsSkeleton.tsx";

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: ad,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["ad", id],
    queryFn: () => fetchAdById(id!),
    enabled: !!id,
  });

  const motionObj = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 },
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
  };

  if (isLoading && !ad) {
    return <LoadingState message="Загрузка объявления..." />;
  }
  if (isError || !ad) {
    return (
      <ErrorState message="Не удалось загрузить объявление" onRetry={refetch} />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="bottom-right" reverseOrder={true} />
      <AdNavigation />
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={motionObj.initial}
          animate={motionObj.animate}
          exit={motionObj.exit}
          transition={motionObj.transition}
          className={motionObj.className}
        >
          <div className="lg:col-span-2 space-y-6">
            {isFetching ? (
              <>
                <ImageGallerySkeleton />
                <AdDetailsSkeleton />
              </>
            ) : (
              <>
                <ImageGallery images={ad.images} />
                <AdDetails ad={ad} />
              </>
            )}
          </div>

          <div className="space-y-6">
            {isFetching ? (
              <SellerCardSkeleton />
            ) : (
              <SellerCard seller={ad.seller} />
            )}

            <ModerationActions adId={id!} />

            {!isFetching && ad.moderationHistory.length > 0 && (
              <ModerationHistory history={ad.moderationHistory} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <ModerationModal />
    </div>
  );
};

export default ItemPage;
