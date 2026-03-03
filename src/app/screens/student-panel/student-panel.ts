import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Publication {
    id: number;
    title: string;
    body: string;
    date: string;
}

interface Comment {
    id: number;
    postTitle: string;
    content: string;
    date: string;
    timeAgo: string;
}

interface Report {
    id: number;
    type: string;
    status: 'Pendiente' | 'Resuelto' | 'Rechazado';
    title: string;
    reason: string;
    description: string;
    date: string;
    timeAgo: string;
}

@Component({
    selector: 'app-student-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './student-panel.html',
    styleUrl: './student-panel.scss'
})
export class StudentPanelComponent {
    activeTab: 'posts' | 'comments' | 'reports' = 'comments';
    showNewPostModal = false;
    showNewReportModal = false;

    newPost = {
        title: '',
        category: '',
        content: '',
        tags: ''
    };

    categories = [
        'Matemáticas',
        'Ciencias',
        'Programación',
        'Idiomas',
        'General'
    ];

    newReport = {
        contentType: '',
        contentTitle: '',
        reason: '',
        description: ''
    };

    contentTypes = [
        'Publicación',
        'Comentario',
        'Usuario'
    ];

    reportReasons = [
        'Spam o publicidad',
        'Contenido ofensivo',
        'Información falsa',
        'Acoso o intimidación',
        'Otro'
    ];

    myPosts: Publication[] = [];

    myComments: Comment[] = [
        {
            id: 1,
            postTitle: 'Pregunta sobre Cálculo Diferencial - Límites',
            content: 'Puedes usar la regla de L\'Hôpital cuando tienes formas indeterminadas como 0/0 o ∞/∞',
            date: '2023-10-25',
            timeAgo: 'Hace 1 hora'
        },
        {
            id: 2,
            postTitle: 'Horarios de Biblioteca para exámenes finales',
            content: 'Gracias por la información! Muy útil para planear mis sesiones de estudio.',
            date: '2023-10-24',
            timeAgo: 'Hace 2 días'
        }
    ];

    myReports: Report[] = [
        {
            id: 1,
            type: 'Publicación',
            status: 'Pendiente',
            title: 'Contenido spam inapropiado',
            reason: 'Spam o publicidad',
            description: 'Este post contiene publicidad no relacionada con temas académicos',
            date: '2023-10-25',
            timeAgo: 'Hace 1 día'
        }
    ];

    setActiveTab(tab: 'posts' | 'comments' | 'reports') {
        this.activeTab = tab;
    }

    openNewPostModal() {
        this.showNewPostModal = true;
    }

    closeNewPostModal() {
        this.showNewPostModal = false;
        this.newPost = { title: '', category: '', content: '', tags: '' };
    }

    publishPost() {
        if (!this.newPost.title.trim() || !this.newPost.content.trim() || !this.newPost.category) {
            return;
        }

        const now = new Date();
        const post: Publication = {
            id: this.myPosts.length + 1,
            title: this.newPost.title,
            body: this.newPost.content,
            date: now.toISOString().split('T')[0]
        };

        this.myPosts.unshift(post);
        this.closeNewPostModal();
    }

    openNewReportModal() {
        this.showNewReportModal = true;
    }

    closeNewReportModal() {
        this.showNewReportModal = false;
        this.newReport = { contentType: '', contentTitle: '', reason: '', description: '' };
    }

    submitReport() {
        if (!this.newReport.contentType || !this.newReport.contentTitle.trim() || !this.newReport.reason || !this.newReport.description.trim()) {
            return;
        }

        const now = new Date();
        const report: Report = {
            id: this.myReports.length + 1,
            type: this.newReport.contentType,
            status: 'Pendiente',
            title: this.newReport.contentTitle,
            reason: this.newReport.reason,
            description: this.newReport.description,
            date: now.toISOString().split('T')[0],
            timeAgo: 'Ahora'
        };

        this.myReports.unshift(report);
        this.closeNewReportModal();
    }
}
