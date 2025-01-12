import { Global, Module, OnModuleInit } from '@nestjs/common';
import { FirebaseNotificationsService } from './firebase.service';
import { initializeApp, cert } from 'firebase-admin/app';
import * as admin from 'firebase-admin';

@Global()
@Module({
    providers: [FirebaseNotificationsService],
    exports: [FirebaseNotificationsService],
})
export class FirebaseModule implements OnModuleInit {
    onModuleInit() {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            });
        console.log('Firebase App initialized');
    }
}
