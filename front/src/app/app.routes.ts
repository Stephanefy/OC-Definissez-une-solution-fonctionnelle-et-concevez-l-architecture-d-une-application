import { Routes } from '@angular/router';
import { ChatBoardComponent } from './components/chat-board/chat-board.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { canActivateGuard } from './guards/can-activate.guard';
import { canActivateAsClientGuard } from './guards/can-activate-as-client.guard';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "chat-board", component: ChatBoardComponent, canActivate: [canActivateGuard]},
    {path: "admin-board", component: AdminComponent, canActivate: [canActivateGuard]},

];
