import { Firestore } from '@google-cloud/firestore';
import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import config from '../../../config/config.js';
import deleteImages from '../../../helpers/delete-images.js';

const firestoreDB = new Firestore();

const deleteRecycledGoods = async (
  request: Request<ReqRefDefaults>,
  h: ResponseToolkit<ReqRefDefaults>
) => {
  const { userId } = request.auth.credentials as {
    userId: string;
  };

  const { recycledGoodsId } = request.params as {
    recycledGoodsId: string;
  };

  const recycledGoodsDocRef = firestoreDB
    .collection(config.CLOUD_FIRESTORE_RECYCLED_ITEMS_COLLECTION)
    .doc(recycledGoodsId);

  const recycledGoodsDoc = await recycledGoodsDocRef.get();

  if (recycledGoodsDoc.exists) {
    await deleteImages({
      recycledType: 'recycled-goods',
      userId,
      recycledId: recycledGoodsId,
    });
  }

  await recycledGoodsDocRef.delete();

  return h
    .response({
      error: false,
      message: 'success',
      data: {},
    })
    .code(200);
};

export default deleteRecycledGoods;
