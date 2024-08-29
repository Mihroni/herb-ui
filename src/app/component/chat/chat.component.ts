import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Group} from "../../model/group";
import {MessageService} from "../../service/message.service";
import {GroupService} from "../../service/group.service";
import {lastValueFrom} from "rxjs";
import {Message} from "../../model/message";
import {MessageDto} from "../../dto/message-dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentUserId!: string;
  username!: string;
  group!: Group;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly groupService: GroupService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getCurrentGroup();
    this.currentUserId = localStorage.getItem('user_id') || '';
    this.username = localStorage.getItem('username') || '';
    await this.loadMessages();
  }

  async getCurrentGroup() {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      const data = this.groupService.findById(groupId);
      this.group = await lastValueFrom(data);
    }
  }

  async loadMessages() {
    const data = this.groupService.viewChat(this.group.id);
    this.messages = await lastValueFrom(data);
    this.messages.sort((message1, message2) => {
      return new Date(message1.sendAt).getTime() - new Date(message2.sendAt).getTime();
    });
  }

  isMessageFromCurrentUser(message: Message): boolean {
    return message.senderId === this.username || message.senderId === this.currentUserId;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    const messageDto: MessageDto = {
      message: this.newMessage,
      groupId: this.group.id,
    };

    try {
      await lastValueFrom(this.messageService.sendMessage(messageDto));
      this.messages.push({
        id: 'temp', // Assign a temporary ID
        message: this.newMessage,
        senderId: this.currentUserId,
        groupId: this.group.id,
        sendAt: new Date().toISOString(),
      });
      this.newMessage = ''; // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
