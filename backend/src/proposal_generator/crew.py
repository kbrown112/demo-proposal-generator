from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai import LLM
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource
from pathlib import Path
import os
import glob
from crewai.knowledge.source.crew_docling_source import CrewDoclingSource
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

# Import Azure credentials
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

def get_azure_llm():
    """Create Azure OpenAI LLM with proper authentication"""
    token_provider = get_bearer_token_provider(
        DefaultAzureCredential(), "api://ailab/Model.Access"
    )

    llm = LLM(
        model="azure/gpt-4o",
        api_base="https://ct-enterprisechat-api.azure-api.net/",
        api_version="2024-10-01-preview",
        azure_ad_token_provider=token_provider
    )
    
    return llm

@CrewBase
class ProposalCrew():
    """ProposalCrew crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def proposal_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['proposal_expert'], # type: ignore[index]
            verbose=True,
            llm=get_azure_llm()
        )

    @agent
    def manager(self) -> Agent:
        return Agent(
            config=self.agents_config['manager'], # type: ignore[index]
            verbose=True,
            llm=get_azure_llm()
        )
    
    @agent
    def analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['analyst'], # type: ignore[index]
            verbose=True,
            llm=get_azure_llm()
        )

    @task
    def proposal_expert_task(self) -> Task:
        return Task(
            config=self.tasks_config['proposal_expert_task'], # type: ignore[index]
        )

    @task
    def manager_task(self) -> Task:
        return Task(
            config=self.tasks_config['manager_task'], # type: ignore[index]
        )
    
    @task
    def analyst_task(self) -> Task:
        return Task(
            config=self.tasks_config['analyst_task'], # type: ignore[index]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the ProposalCrew crew"""
        
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,           
        )