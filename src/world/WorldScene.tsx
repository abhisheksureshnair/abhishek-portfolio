'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Compass,
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  Camera,
  Activity,
  GitFork,
  Building2,
  RotateCcw,
} from 'lucide-react';
import { avatarGameplayState } from './avatar/avatarGameplayState';
import { WorldCanvas } from './WorldCanvas';
import { PerformanceMonitorHUD } from './performance/PerformanceMonitor';
import { useWorldStore, worldStore } from './stores/worldStore';
import { getCityRoadNetwork, CityBlockData } from './WorldConfig';
import { AvatarInteractionPrompt } from './avatar/AvatarInteractionPrompt';
import { AvatarMobileControls } from './avatar/AvatarMobileControls';
import { PointerLockOverlay } from './avatar/PointerLockOverlay';

// Preserve existing portfolio interactive overlays for the 6 districts
import { HeroBuildingOverlay } from '@/components/three-world/HeroBuildingOverlay';
import { AboutBuildingOverlay } from '@/components/three-world/AboutBuildingOverlay';
import { ProjectsBuildingOverlay } from '@/components/three-world/ProjectsBuildingOverlay';
import { SkillsBuildingOverlay } from '@/components/three-world/SkillsBuildingOverlay';
import { ExperienceBuildingOverlay } from '@/components/three-world/ExperienceBuildingOverlay';
import { CareerBuildingOverlay } from '@/components/three-world/CareerBuildingOverlay';
import { ContactBuildingOverlay } from '@/components/three-world/ContactBuildingOverlay';
import { AIResearchOverlay } from '@/components/three-world/AIResearchOverlay';
import { CloudHubOverlay } from '@/components/three-world/CloudHubOverlay';

interface WorldSceneProps {
  onSwitchToStory?: () => void;
}

export const WorldScene: React.FC<WorldSceneProps> = ({ onSwitchToStory }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const network = useMemo(() => getCityRoadNetwork(), []);

  // Store state
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const setCameraMode = useWorldStore((s) => s.setCameraMode);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);
  const setCameraPreset = useWorldStore((s) => s.setCameraPreset);
  const setCameraView = useWorldStore((s) => s.setCameraView);
  const downtownMode = useWorldStore((s) => s.downtownMode);
  const setDowntownMode = useWorldStore((s) => s.setDowntownMode);
  const toggleDowntownMode = useWorldStore((s) => s.toggleDowntownMode);
  const toggleCameraMode = useWorldStore((s) => s.toggleCameraMode);
  const isCameraPresetMenuOpen = useWorldStore((s) => s.isCameraPresetMenuOpen);
  const toggleCameraPresetMenu = useWorldStore((s) => s.toggleCameraPresetMenu);
  const timeOfDay = useWorldStore((s) => s.timeOfDay);
  const setTimeOfDay = useWorldStore((s) => s.setTimeOfDay);
  const showPerfMonitor = useWorldStore((s) => s.showPerfMonitor);
  const togglePerfMonitor = useWorldStore((s) => s.togglePerfMonitor);
  const showNavDebug = useWorldStore((s) => s.showNavDebug);
  const toggleNavDebug = useWorldStore((s) => s.toggleNavDebug);
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const setSelectedLandmark = useWorldStore((s) => s.setSelectedLandmark);
  const qualityProfile = useWorldStore((s) => s.qualityProfile);
  const effectiveQuality = useWorldStore((s) => s.effectiveQuality);
  const toggleQualityProfile = useWorldStore((s) => s.toggleQualityProfile);

  // Synchronize view and mode query params
  useEffect(() => {
    const v = searchParams.get('view');
    const full = searchParams.get('full');
    const mode = searchParams.get('mode');
    const lmark = searchParams.get('landmark');
    const tod = searchParams.get('timeOfDay') || searchParams.get('time');
    const floorParam = searchParams.get('floor');
    const overlayParam = searchParams.get('overlay');
    const tabParam = searchParams.get('tab');

    if (overlayParam === 'career' || overlayParam === 'exp') {
      setSelectedOverlay('career');
    } else if (overlayParam === 'about' || overlayParam === 'studio') {
      setSelectedOverlay('about');
    } else if (overlayParam === 'skills') {
      setSelectedOverlay('skills');
    } else if (overlayParam === 'projects') {
      setSelectedOverlay('projects');
    } else if (overlayParam === 'contact' || overlayParam === 'hub' || overlayParam === 'collab') {
      setSelectedOverlay('contact');
    } else if (overlayParam === 'ai' || overlayParam === 'ai-lab' || overlayParam === 'research') {
      setSelectedOverlay('ai');
    } else if (overlayParam === 'cloud' || overlayParam === 'cloud-hub' || overlayParam === 'cloud-nexus') {
      setSelectedOverlay('cloud');
    }

    if (tabParam === 'timeline' || tabParam === 'education' || tabParam === 'resume' || tabParam === 'experience') {
      setCareerInitialTab(tabParam);
    }
    if (tabParam === 'intro' || tabParam === 'journey' || tabParam === 'education' || tabParam === 'media') {
      setAboutInitialTab(tabParam);
    }
    if (tabParam === 'form' || tabParam === 'socials' || tabParam === 'collaboration' || tabParam === 'resume') {
      setContactInitialTab(tabParam);
    }
    if (tabParam === 'overview' || tabParam === 'topics' || tabParam === 'demos' || tabParam === 'projects') {
      setAiInitialTab(tabParam);
    }

    if (tod === 'day' || tod === 'sunset' || tod === 'night') {
      setTimeOfDay(tod);
    }

    if (floorParam !== null) {
      const f = parseInt(floorParam, 10);
      if (!isNaN(f)) setSelectedSkillFloor(f);
    }

    if (lmark === 'hq' || lmark === 'developer_hq') {
      setSelectedLandmark('hq');
    } else if (lmark === 'innovation' || lmark === 'inno') {
      setSelectedLandmark('innovation');
    } else if (lmark === 'skills' || lmark === 'skills_tower' || lmark === 'skill') {
      setSelectedLandmark('skills');
    } else if (lmark === 'career' || lmark === 'career_center' || lmark === 'exp') {
      setSelectedLandmark('career');
    } else if (lmark === 'about' || lmark === 'about_studio' || lmark === 'me') {
      setSelectedLandmark('about');
    } else if (lmark === 'contact' || lmark === 'contact_hub' || lmark === 'hub') {
      setSelectedLandmark('contact');
    } else if (lmark === 'ai' || lmark === 'ai_center' || lmark === 'ai_lab' || lmark === 'research') {
      setSelectedLandmark('ai');
    } else if (lmark === 'cloud' || lmark === 'cloud_hub' || lmark === 'cloud_nexus') {
      setSelectedLandmark('cloud');
    }

    if (full === 'true' || mode === 'full') {
      setDowntownMode('full');
    } else if (full === 'false' || mode === 'ref' || mode === 'reference') {
      setDowntownMode('reference');
    }

    if (mode === 'avatar' || searchParams.get('camera') === 'avatar' || v === 'avatar') {
      setCameraMode('avatar');
    }

    if (!v) return;
    if (v === 'central_hq_overview' || v === 'hq_center' || v === 'hq_overview' || v === 'hq_main') {
      setCameraView('orbit', 'central_hq_overview');
    } else if (v === 'both_landmarks_elevated' || v === 'both_landmarks' || v === 'elevated_landmarks') {
      setCameraView('orbit', 'both_landmarks_elevated');
    } else if (v === 'hq_roof_cleanup' || v === 'roof_cleanup' || v === 'rooftop_cleanup') {
      setCameraView('orbit', 'hq_roof_cleanup');
    } else if (v === 'directory_board_hq' || v === 'hq_directory') {
      setCameraView('orbit', 'directory_board_hq');
    } else if (v === 'directory_board_innovation' || v === 'inno_directory') {
      setCameraView('orbit', 'directory_board_innovation');
    } else if (v === 'hq_front_entrance' || v === 'hq_entrance' || v === 'hq_front' || v === 'hq1') {
      setCameraView('orbit', 'hq_front_entrance');
    } else if (v === 'hq_three_quarter' || v === 'hq_perspective' || v === 'hq2') {
      setCameraView('orbit', 'hq_three_quarter');
    } else if (v === 'hq_street_level' || v === 'hq_street' || v === 'hq3') {
      setCameraView('story', 'hq_street_level');
    } else if (v === 'hq_elevated_overview' || v === 'hq_elevated' || v === 'hq_aerial' || v === 'hq4') {
      setCameraView('orbit', 'hq_elevated_overview');
    } else if (v === 'hq_roof_skyline' || v === 'hq_skyline' || v === 'hq_roof' || v === 'hq5') {
      setCameraView('orbit', 'hq_roof_skyline');
    } else if (v === 'innovation_front_entrance' || v === 'inno_front' || v === 'inno1') {
      setCameraView('orbit', 'innovation_front_entrance');
    } else if (v === 'innovation_three_quarter' || v === 'inno_34' || v === 'inno2') {
      setCameraView('orbit', 'innovation_three_quarter');
    } else if (v === 'innovation_rooftop' || v === 'inno_roof' || v === 'inno3') {
      setCameraView('orbit', 'innovation_rooftop');
    } else if (v === 'innovation_interior_atrium' || v === 'inno_atrium' || v === 'inno4') {
      setCameraView('orbit', 'innovation_interior_atrium');
    } else if (v === 'innovation_projects_gallery' || v === 'inno_gallery' || v === 'inno5') {
      setCameraView('orbit', 'innovation_projects_gallery');
    } else if (v === 'innovation_downtown_overview' || v === 'inno_overview' || v === 'inno6') {
      setCameraView('orbit', 'innovation_downtown_overview');
    } else if (v === 'skills_front_entrance' || v === 'skills_entrance' || v === 'skills1') {
      setCameraView('orbit', 'skills_front_entrance');
    } else if (v === 'skills_three_quarter' || v === 'skills_exterior' || v === 'skills2') {
      setCameraView('orbit', 'skills_three_quarter');
    } else if (v === 'skills_street_approach' || v === 'skills_approach' || v === 'skills3') {
      setCameraView('story', 'skills_street_approach');
    } else if (v === 'skills_elevated_overview' || v === 'skills_elevated' || v === 'skills4') {
      setCameraView('orbit', 'skills_elevated_overview');
    } else if (v === 'skills_lobby' || v === 'skills_interior' || v === 'skills5') {
      setCameraView('story', 'skills_lobby');
    } else if (v === 'landmarks_skyline' || v === 'three_landmarks' || v === 'skills6') {
      setCameraView('orbit', 'landmarks_skyline');
    } else if (v === 'career_front_entrance' || v === 'career_entrance' || v === 'career1') {
      setCameraView('orbit', 'career_front_entrance');
    } else if (v === 'career_three_quarter' || v === 'career_exterior' || v === 'career2') {
      setCameraView('orbit', 'career_three_quarter');
    } else if (v === 'career_elevated_overview' || v === 'career_elevated' || v === 'career3') {
      setCameraView('orbit', 'career_elevated_overview');
    } else if (v === 'career_lobby' || v === 'career_timeline' || v === 'career4') {
      setCameraView('orbit', 'career_lobby');
    } else if (v === 'career_street_view' || v === 'career_street' || v === 'career5') {
      setCameraView('story', 'career_street_view');
    } else if (v === 'four_landmarks_aerial' || v === 'four_landmarks' || v === 'career6') {
      setCameraView('orbit', 'four_landmarks_aerial');
    } else if (v === 'about_front_entrance' || v === 'about_entrance' || v === 'about1') {
      setCameraView('orbit', 'about_front_entrance');
    } else if (v === 'about_three_quarter' || v === 'about_exterior' || v === 'about2') {
      setCameraView('orbit', 'about_three_quarter');
    } else if (v === 'about_rooftop_terrace' || v === 'about_terrace' || v === 'about3') {
      setCameraView('orbit', 'about_rooftop_terrace');
    } else if (v === 'about_developer_journey' || v === 'about_journey' || v === 'about4') {
      setCameraView('orbit', 'about_developer_journey');
    } else if (v === 'about_personal_intro' || v === 'about_intro' || v === 'about5') {
      setCameraView('orbit', 'about_personal_intro');
    } else if (v === 'about_street_view' || v === 'about_street' || v === 'about6') {
      setCameraView('story', 'about_street_view');
    } else if (v === 'five_landmarks_aerial' || v === 'five_landmarks' || v === 'all_landmarks' || v === 'about7') {
      setCameraView('orbit', 'five_landmarks_aerial');
    } else if (v === 'contact_front_entrance' || v === 'contact_front' || v === 'contact1') {
      setCameraView('orbit', 'contact_front_entrance');
    } else if (v === 'contact_three_quarter' || v === 'contact_34' || v === 'contact2') {
      setCameraView('orbit', 'contact_three_quarter');
    } else if (v === 'contact_rooftop_terrace' || v === 'contact_roof' || v === 'contact3') {
      setCameraView('orbit', 'contact_rooftop_terrace');
    } else if (v === 'contact_interior_globe' || v === 'contact_globe' || v === 'contact4') {
      setCameraView('orbit', 'contact_interior_globe');
    } else if (v === 'contact_collaboration_showcase' || v === 'contact_collab' || v === 'contact5') {
      setCameraView('orbit', 'contact_collaboration_showcase');
    } else if (v === 'contact_street_view' || v === 'contact_street' || v === 'contact6') {
      setCameraView('story', 'contact_street_view');
    } else if (v === 'all_six_landmarks_aerial' || v === 'six_landmarks' || v === 'all_six' || v === 'contact7') {
      setCameraView('orbit', 'all_six_landmarks_aerial');
    } else if (v === 'ai_front_entrance' || v === 'ai_front' || v === 'ai1') {
      setCameraView('orbit', 'ai_front_entrance');
    } else if (v === 'ai_three_quarter' || v === 'ai_34' || v === 'ai2') {
      setCameraView('orbit', 'ai_three_quarter');
    } else if (v === 'ai_elevated_exterior' || v === 'ai_elevated' || v === 'ai3') {
      setCameraView('orbit', 'ai_elevated_exterior');
    } else if (v === 'ai_atrium_hologram' || v === 'ai_atrium' || v === 'ai_hologram' || v === 'ai4') {
      setCameraView('orbit', 'ai_atrium_hologram');
    } else if (v === 'ai_street_view' || v === 'ai_street' || v === 'ai5') {
      setCameraView('orbit', 'ai_street_view');
    } else if (v === 'all_seven_landmarks_aerial' || v === 'seven_landmarks' || v === 'all_seven' || v === 'ai7') {
      setCameraView('orbit', 'all_seven_landmarks_aerial');
    } else if (v === 'both_refined_elevated' || v === 'both_refined' || v === 'refined_both') {
      setCameraView('orbit', 'both_refined_elevated');
    } else if (v === 'ai_rooftop_refined' || v === 'ai_rooftop' || v === 'ai_roof') {
      setCameraView('orbit', 'ai_rooftop_refined');
    } else if (v === 'contact_rooftop_refined' || v === 'contact_roof_refined') {
      setCameraView('orbit', 'contact_rooftop_refined');
    } else if (v === 'cloud_front_entrance' || v === 'cloud_entrance' || v === 'cloud1') {
      setCameraView('orbit', 'cloud_front_entrance');
    } else if (v === 'cloud_three_quarter' || v === 'cloud_34' || v === 'cloud2') {
      setCameraView('orbit', 'cloud_three_quarter');
    } else if (v === 'cloud_street_approach' || v === 'cloud_street' || v === 'cloud3') {
      setCameraView('orbit', 'cloud_street_approach');
    } else if (v === 'cloud_lobby_view' || v === 'cloud_lobby_interior' || v === 'cloud4') {
      setCameraView('orbit', 'cloud_lobby_view');
    } else if (v === 'cloud_skyline' || v === 'cloud_elevated_exterior' || v === 'cloud5') {
      setCameraView('orbit', 'cloud_skyline');
    } else if (v === 'all_nine_landmarks_aerial' || v === 'all_nine' || v === 'nine_landmarks') {
      setCameraView('orbit', 'all_nine_landmarks_aerial');
    } else if (v === 'full_island_aerial' || v === 'island' || v === 'island_aerial' || v === '1') {
      setCameraView('orbit', 'full_island_aerial');
    } else if (v === 'city_to_coast_transition' || v === 'transition' || v === '2') {
      setCameraView('orbit', 'city_to_coast_transition');
    } else if (v === 'waterfront_street_level' || v === 'waterfront' || v === '3') {
      setCameraView('orbit', 'waterfront_street_level');
    } else if (v === 'harbor_overview' || v === 'harbor' || v === '4') {
      setCameraView('orbit', 'harbor_overview');
    } else if (v === 'ocean_horizon' || v === 'horizon' || v === '5') {
      setCameraView('orbit', 'ocean_horizon');
    } else if (v === 'max_orbit_distance' || v === 'max_orbit' || v === '6') {
      setCameraView('orbit', 'max_orbit_distance');
    } else if (v === 'downtown_skyline') {
      setCameraView('orbit', 'downtown_skyline');
    } else if (v === 'waterfront_view') {
      setCameraView('orbit', 'waterfront_view');
    } else if (v === 'high_altitude_island' || v === 'high_altitude') {
      setCameraView('orbit', 'high_altitude_island');
    } else if (v === 'street_level_downtown') {
      setCameraView('orbit', 'street_level_downtown');
    } else if (v === 'cardinal_north' || v === 'north') {
      setCameraView('orbit', 'cardinal_north');
    } else if (v === 'cardinal_south' || v === 'south') {
      setCameraView('orbit', 'cardinal_south');
    } else if (v === 'cardinal_east' || v === 'east') {
      setCameraView('orbit', 'cardinal_east');
    } else if (v === 'cardinal_west' || v === 'west') {
      setCameraView('orbit', 'cardinal_west');
    } else if (v === 'aerial_overview' || v === 'downtown_overview' || v === 'orbit') {
      setCameraView('orbit', 'aerial_overview');
    } else if (v === 'aerial_transition' || v === 'transition') {
      setCameraView('orbit', 'aerial_transition');
    } else if (v === 'street_skyline') {
      setCameraView('orbit', 'street_skyline');
    } else if (v === 'outer_boundary' || v === 'boundary') {
      setCameraView('orbit', 'outer_boundary');
    } else if (v === 'street_intersection' || v === 'intersection') {
      setCameraView('orbit', 'street_intersection');
    } else if (v === 'facade_close_up' || v === 'facades') {
      setCameraView('orbit', 'facade_close_up');
    } else if (v === 'central_district' || v === 'portfolio') {
      setCameraView('orbit', 'central_district');
    } else if (v === 'distant_skyline' || v === 'skyline') {
      setCameraView('orbit', 'distant_skyline');
    } else if (v === 'street_downtown' || v === 'street') {
      setCameraView('story', 'street_downtown');
    } else if (v === 'ref_block' || v === 'ref_three_quarter') {
      setCameraView('orbit', 'ref_block');
    } else if (v === 'ref_street_front' || v === 'ref_street') {
      setCameraView('story', 'ref_street_front');
    } else if (v === 'ref_elevated_overview' || v === 'ref_orbit') {
      setCameraView('orbit', 'ref_elevated_overview');
    }
  }, [searchParams, setCameraView, setDowntownMode, setSelectedLandmark, setTimeOfDay]);

  // Overlay state for the 6 reserved portfolio plots
  const [activePlot, setActivePlot] = useState<CityBlockData | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSkillFloor, setSelectedSkillFloor] = useState<number | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<
    'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'career' | 'contact' | 'ai' | 'cloud' | null
  >(null);
  const [careerInitialTab, setCareerInitialTab] = useState<'experience' | 'education' | 'timeline' | 'resume'>('experience');
  const [aboutInitialTab, setAboutInitialTab] = useState<'intro' | 'journey' | 'education' | 'media'>('intro');
  const [contactInitialTab, setContactInitialTab] = useState<'form' | 'socials' | 'collaboration' | 'resume'>('form');
  const [aiInitialTab, setAiInitialTab] = useState<'overview' | 'topics' | 'demos' | 'projects'>('overview');

  const handleSelectPlot = useCallback((block: CityBlockData) => {
    setActivePlot(block);
    const pId = block.reservedPlot?.id;
    if (pId === 'hq') setSelectedOverlay('hero');
    else if (pId === 'about') setSelectedOverlay('about');
    else if (pId === 'projects') {
      setSelectedProjectId(null);
      setSelectedOverlay('projects');
    }
    else if (pId === 'skills') setSelectedOverlay('skills');
    else if (pId === 'career') setSelectedOverlay('experience');
    else if (pId === 'contact') setSelectedOverlay('contact');
    else if (pId === 'ai-lab' || pId === 'ai') setSelectedOverlay('ai');
    else if (pId === 'cloud-nexus' || pId === 'cloud') setSelectedOverlay('cloud');
  }, []);

  // Sync active modal overlay state with WorldStore avatar interaction flag
  useEffect(() => {
    worldStore.getState().setIsInteracting(selectedOverlay !== null);
  }, [selectedOverlay]);

  // Global Escape key listener: closes any active portfolio modal, preset menu and restores avatar mode
  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        if (isCameraPresetMenuOpen) {
          worldStore.getState().setIsCameraPresetMenuOpen(false);
        }
        if (selectedOverlay !== null) {
          setSelectedOverlay(null);
          worldStore.getState().setIsInteracting(false);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, [selectedOverlay, isCameraPresetMenuOpen]);

  const handleToggleTimeOfDay = () => {
    setTimeOfDay(timeOfDay === 'day' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'day');
  };

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-[#090d16]">
      {/* 1. Main 3D WebGL Canvas */}
      <WorldCanvas
        referenceBlockOnly={downtownMode === 'reference'}
        onHQInteract={() => {
          const hqBlock = network.blocks.find((b) => b.reservedPlot?.id === 'hq');
          if (hqBlock) handleSelectPlot(hqBlock);
        }}
        onInnovationInteract={() => {
          setSelectedProjectId(null);
          setSelectedOverlay('projects');
        }}
        onSelectProject={(projectId) => {
          setSelectedProjectId(projectId);
          setSelectedOverlay('projects');
        }}
        onSkillsInteract={() => {
          setSelectedSkillFloor(null);
          setSelectedOverlay('skills');
        }}
        onSelectSkillFloor={(floor) => {
          setSelectedSkillFloor(floor);
          setSelectedOverlay('skills');
        }}
        selectedSkillFloor={selectedSkillFloor}
        onCareerInteract={() => {
          setSelectedOverlay('career');
        }}
        onAboutInteract={() => {
          setSelectedOverlay('about');
        }}
        onContactInteract={() => {
          setSelectedOverlay('contact');
        }}
        onAIInteract={() => {
          setSelectedOverlay('ai');
        }}
        onCloudInteract={() => {
          setSelectedOverlay('cloud');
        }}
      />

      {/* 2. Top Navigation Bar (Portfolio Navigation, Mode Selectors & Landmark Navigation) */}
      <header className="fixed top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Row 1: Left Portfolio Navigation & Right System Controls */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Left: Classic Portfolio Return, Story Switcher & Development Status */}
          <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all shadow-lg shadow-black/40 hover:scale-105 active:scale-95"
              title="Return to Classic Portfolio"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Classic Portfolio</span>
            </button>

            {onSwitchToStory && (
              <button
                onClick={onSwitchToStory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-white text-xs font-mono font-bold backdrop-blur-md transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95"
                title="Switch to Cinematic Story Scrollytelling Mode"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>STORY VIEW</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white text-xs font-mono backdrop-blur-md">
              <span
                className={`w-2 h-2 rounded-full ${downtownMode === 'full' ? 'bg-emerald-400' : 'bg-amber-400'
                  } animate-pulse`}
              />
              <span className="font-bold tracking-wider">
                {downtownMode === 'full'
                  ? 'PHASE 2.10 // 3D METROPOLIS'
                  : 'PHASE 2.10 // REF BLOCK'}
              </span>
            </div>

            {/* Development Toggle: Reference Block vs Full Downtown */}
            <button
              onClick={toggleDowntownMode}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${downtownMode === 'full'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-amber-500/20 border-amber-400 text-amber-300'
                }`}
              title="Toggle between Full Downtown and Reference Block (block_1_3 only)"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {downtownMode === 'full'
                  ? 'FULL DOWNTOWN'
                  : 'REF BLOCK'}
              </span>
            </button>
          </div>

          {/* Right: Camera Mode Switcher, Presets Drawer, Nav Debug & Environment Controls */}
          <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
            {/* Autonomous Vehicle Navigation Graph Debug Toggle */}
            <button
              onClick={toggleNavDebug}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${showNavDebug
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-400 text-white shadow-amber-500/30'
                : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-white'
                }`}
              title="Toggle Autonomous Vehicle & Pedestrian Navigation Graph"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">NAV GRAPH</span>
            </button>

            {/* Camera Mode Toggle: Orbit vs Avatar (Playable Walk) vs Story View */}
            <button
              onClick={toggleCameraMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono tracking-wider backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${cameraMode === 'avatar'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : cameraMode === 'orbit'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 border-cyan-400/40 text-white shadow-indigo-600/30'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400/40 text-white shadow-purple-600/30'
                }`}
              title="Switch between Playable Avatar mode, Orbit overview, and Story view"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {cameraMode === 'avatar'
                  ? 'AVATAR MODE'
                  : cameraMode === 'orbit'
                    ? 'ORBIT MODE'
                    : 'STORY VIEW'}
              </span>
            </button>

            {/* Camera Presets Menu Flyout Toggle */}
            <button
              onClick={toggleCameraPresetMenu}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${isCameraPresetMenuOpen
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
                : 'bg-zinc-950/80 border-white/10 text-zinc-300 hover:text-white hover:border-cyan-400/40'
                }`}
              title="Toggle Camera Presets Menu (Curated angles and aerials)"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">PRESETS</span>
            </button>

            {/* Failsafe Camera Recovery Button */}
            <button
              onClick={() => {
                if (cameraMode === 'avatar') {
                  avatarGameplayState.initializeSpawn(0);
                  window.dispatchEvent(new CustomEvent('reset-avatar-camera'));
                } else {
                  setCameraPreset(null);
                  window.dispatchEvent(new CustomEvent('reset-camera'));
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
              title="Reset Camera to default center perspective (Shortcut: R)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">RESET</span>
            </button>

            {/* Time of Day Toggle */}
            <button
              onClick={handleToggleTimeOfDay}
              className="p-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
              title={`Current: ${timeOfDay}. Click to change lighting.`}
            >
              {timeOfDay === 'day' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : timeOfDay === 'sunset' ? (
                <Sunset className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>

            {/* Telemetry Toggle */}
            <button
              onClick={togglePerfMonitor}
              className={`p-1.5 rounded-xl border backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${showPerfMonitor
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-white'
                }`}
              title="Toggle Engine Diagnostics"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>

            {/* Graphics Quality Profile Toggle (Auto / High / Medium / Low) */}
            <button
              onClick={toggleQualityProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 hover:border-cyan-400/40 text-xs font-mono backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
              title={`Graphics Quality: ${qualityProfile.toUpperCase()} (Effective: ${effectiveQuality.toUpperCase()}). Click to toggle.`}
            >
              <span
                className={`w-2 h-2 rounded-full ${qualityProfile === 'auto'
                  ? 'bg-cyan-400 animate-pulse'
                  : effectiveQuality === 'high'
                    ? 'bg-emerald-400'
                    : effectiveQuality === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
              />
              <span className="font-bold text-zinc-300">
                {qualityProfile === 'auto' ? 'AUTO' : qualityProfile.toUpperCase()}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Responsive Clickable Landmark Directory Bar (Horizontally Scrollable, Non-Wrapping) */}
        <div className="flex justify-center w-full">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-950/90 border border-white/15 backdrop-blur-md pointer-events-auto shadow-xl max-w-full overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 font-bold tracking-wider shrink-0 hidden sm:inline">
              LANDMARKS:
            </span>
            <button
              onClick={() => {
                setSelectedLandmark('hq');
                setCameraView('orbit', 'central_hq_overview');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'hq'
                ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Developer HQ (City Center [0, 0])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>DEVELOPER HQ</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('innovation');
                setCameraView('orbit', 'innovation_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'innovation'
                ? 'bg-purple-500/30 border border-purple-400 text-purple-200 shadow-md shadow-purple-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Innovation & Projects Center ([40, -40])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>INNOVATION CENTER</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('skills');
                setCameraView('orbit', 'skills_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'skills'
                ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Skills & Technology Tower ([-40, 0])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SKILLS TOWER</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('career');
                setCameraView('orbit', 'career_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'career'
                ? 'bg-amber-500/30 border border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Career & Experience Center ([40, 0])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>CAREER CENTER</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('about');
                setCameraView('orbit', 'about_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'about'
                ? 'bg-orange-500/30 border border-orange-400 text-orange-200 shadow-md shadow-orange-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus About Me Studio ([0, -40])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>ABOUT STUDIO</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('contact');
                setCameraView('orbit', 'contact_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'contact'
                ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Contact & Collaboration Hub ([-40, 40])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>CONTACT HUB</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('ai');
                setCameraView('orbit', 'ai_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'ai'
                ? 'bg-purple-500/30 border border-purple-400 text-purple-200 shadow-md shadow-purple-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus AI Research & Innovation Center ([0, 40])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>AI RESEARCH</span>
            </button>
            <button
              onClick={() => {
                setSelectedLandmark('cloud');
                setCameraView('orbit', 'cloud_three_quarter');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${selectedLandmark === 'cloud'
                ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5'
                }`}
              title="Select & Focus Cloud & Systems Engineering Hub ([40, 40])"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>CLOUD HUB</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2b. Right-Side Camera Presets Flyout Menu (Non-overlapping, responsive, scrollable) */}
      {isCameraPresetMenuOpen && (
        <aside
          aria-label="Camera Presets Menu"
          className="fixed top-24 sm:top-28 right-3 sm:right-4 z-40 w-72 max-h-[min(380px,calc(100vh-440px))] overflow-y-auto rounded-2xl bg-zinc-950/95 border border-cyan-500/30 backdrop-blur-xl p-3 shadow-2xl pointer-events-auto text-zinc-300 animate-in fade-in slide-in-from-right-4 duration-200"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">Camera Presets</span>
            </div>
            <button
              onClick={toggleCameraPresetMenu}
              className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white text-xs font-mono transition-colors"
              title="Close Presets Menu"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {/* Group 1: 8 Landmark Buildings */}
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400/80 px-1 mb-1 tracking-wider">
                Landmark Perspectives
              </div>
              <div className="space-y-1">
                {[
                  { id: 'central_hq_overview', label: '1. Central HQ Overview', landmark: 'hq' as const },
                  { id: 'hq_front_entrance', label: '2. HQ Grand Entrance', landmark: 'hq' as const },
                  { id: 'hq_three_quarter', label: '3. HQ 3/4 Exterior', landmark: 'hq' as const },
                  { id: 'innovation_front_entrance', label: '4. Innovation Entrance', landmark: 'innovation' as const },
                  { id: 'innovation_three_quarter', label: '5. Innovation 3/4 View', landmark: 'innovation' as const },
                  { id: 'skills_three_quarter', label: '6. Skills Tower 3/4 View', landmark: 'skills' as const },
                  { id: 'career_three_quarter', label: '7. Career Center 3/4 View', landmark: 'career' as const },
                  { id: 'about_three_quarter', label: '8. About Studio 3/4 View', landmark: 'about' as const },
                  { id: 'contact_three_quarter', label: '9. Contact Hub 3/4 View', landmark: 'contact' as const },
                  { id: 'ai_three_quarter', label: '10. AI Research 3/4 View', landmark: 'ai' as const },
                  { id: 'cloud_three_quarter', label: '11. Cloud Hub 3/4 View', landmark: 'cloud' as const },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedLandmark(item.landmark);
                      setCameraView('orbit', item.id as any);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between ${cameraPreset === item.id
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold'
                      : 'hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>{item.label}</span>
                    {cameraPreset === item.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: Aerials & City Scenery */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] uppercase font-bold text-amber-400/80 px-1 mb-1 tracking-wider">
                Aerial & City Scenery
              </div>
              <div className="space-y-1">
                {[
                  { id: 'both_landmarks_elevated', label: '12. Both Central Landmarks' },
                  { id: 'all_nine_landmarks_aerial', label: '13. All 9 Districts Aerial' },
                  { id: 'full_island_aerial', label: '14. Full Island Aerial' },
                  { id: 'downtown_skyline', label: '15. Downtown Skyline' },
                  { id: 'waterfront_street_level', label: '16. Waterfront Promenade' },
                  { id: 'street_level_downtown', label: '17. Street-Level Canyon' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCameraView('orbit', item.id as any);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between ${cameraPreset === item.id
                      ? 'bg-amber-500/20 border border-amber-400 text-amber-200 font-bold'
                      : 'hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>{item.label}</span>
                    {cameraPreset === item.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 2c. Persistent Selected Landmark HUD Bar (Positioned below the landmark row with guaranteed clearance) */}
      {selectedLandmark && (
        <div className="fixed top-28 sm:top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[calc(100vw-32px)]">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-zinc-950/95 border border-cyan-400/60 backdrop-blur-md shadow-2xl shadow-cyan-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-2 truncate">
                <span className="hidden sm:inline text-zinc-400">★ SELECTED:</span>
                <span className="text-cyan-400 font-extrabold truncate">
                  {selectedLandmark === 'hq'
                    ? 'DEVELOPER HQ'
                    : selectedLandmark === 'skills'
                      ? 'SKILLS & TECHNOLOGY TOWER'
                      : selectedLandmark === 'career'
                        ? 'CAREER & EXPERIENCE CENTER'
                        : selectedLandmark === 'about'
                          ? 'ABOUT ME STUDIO'
                          : selectedLandmark === 'contact'
                            ? 'CONTACT & COLLABORATION HUB'
                            : selectedLandmark === 'ai'
                              ? 'AI RESEARCH CENTER'
                              : selectedLandmark === 'cloud'
                                ? 'CLOUD ECOSYSTEM HUB'
                                : 'INNOVATION & PROJECTS CENTER'}
                </span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 truncate hidden md:inline">
                {selectedLandmark === 'hq'
                  ? 'City Center [0, 0] • Full Stack • Web • Mobile'
                  : selectedLandmark === 'skills'
                    ? 'West Parcel [-40, 0] • Full Stack • Mobile • Cloud • AI'
                    : selectedLandmark === 'career'
                      ? 'East Parcel [40, 0] • Software Engineering • Professional Journey'
                      : selectedLandmark === 'about'
                        ? 'North Parcel [0, -40] • My Story • Education • Developer Journey'
                        : selectedLandmark === 'contact'
                          ? 'Northwest Parcel [-40, 40] • Let\'s Connect • Build • Innovate'
                          : selectedLandmark === 'ai'
                            ? 'North Central Parcel [0, 40] • Artificial Intelligence • Python • Research'
                            : selectedLandmark === 'cloud'
                              ? 'Southeast Parcel [40, 40] • Connect • Build • Deploy • Cloud Architecture'
                              : 'Southeast Parcel [40, -40] • Projects • Research • Development'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <button
                onClick={() => {
                  if (selectedLandmark === 'hq') {
                    setCameraView('orbit', 'hq_front_entrance');
                  } else if (selectedLandmark === 'skills') {
                    setCameraView('orbit', 'skills_front_entrance');
                  } else if (selectedLandmark === 'career') {
                    setCameraView('orbit', 'career_front_entrance');
                  } else if (selectedLandmark === 'about') {
                    setCameraView('orbit', 'about_front_entrance');
                  } else if (selectedLandmark === 'contact') {
                    setCameraView('orbit', 'contact_front_entrance');
                  } else if (selectedLandmark === 'ai') {
                    setCameraView('orbit', 'ai_front_entrance');
                  } else if (selectedLandmark === 'cloud') {
                    setCameraView('orbit', 'cloud_front_entrance');
                  } else {
                    setCameraView('orbit', 'innovation_front_entrance');
                  }
                }}
                className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 transition-all font-bold"
              >
                Entrance
              </button>
              <button
                onClick={() => {
                  if (selectedLandmark === 'hq') {
                    setCameraView('orbit', 'central_hq_overview');
                  } else if (selectedLandmark === 'skills') {
                    setCameraView('orbit', 'skills_three_quarter');
                  } else if (selectedLandmark === 'career') {
                    setCameraView('orbit', 'career_three_quarter');
                  } else if (selectedLandmark === 'about') {
                    setCameraView('orbit', 'about_three_quarter');
                  } else if (selectedLandmark === 'contact') {
                    setCameraView('orbit', 'contact_three_quarter');
                  } else if (selectedLandmark === 'ai') {
                    setCameraView('orbit', 'ai_three_quarter');
                  } else if (selectedLandmark === 'cloud') {
                    setCameraView('orbit', 'cloud_three_quarter');
                  } else {
                    setCameraView('orbit', 'innovation_three_quarter');
                  }
                }}
                className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-[10px] font-mono text-zinc-200 transition-all"
              >
                Overview
              </button>
              {selectedLandmark === 'skills' && (
                <button
                  onClick={() => setSelectedOverlay('skills')}
                  className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-[10px] font-mono text-emerald-200 transition-all font-bold"
                >
                  Floor Directory
                </button>
              )}
              {selectedLandmark === 'career' && (
                <button
                  onClick={() => setSelectedOverlay('career')}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[10px] font-mono text-amber-200 transition-all font-bold"
                >
                  Career Dashboard
                </button>
              )}
              {selectedLandmark === 'about' && (
                <button
                  onClick={() => setSelectedOverlay('about')}
                  className="px-2 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-[10px] font-mono text-orange-200 transition-all font-bold"
                >
                  About Exhibition
                </button>
              )}
              {selectedLandmark === 'contact' && (
                <button
                  onClick={() => setSelectedOverlay('contact')}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 transition-all font-bold"
                >
                  Contact Terminal
                </button>
              )}
              {selectedLandmark === 'ai' && (
                <button
                  onClick={() => setSelectedOverlay('ai')}
                  className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-[10px] font-mono text-purple-200 transition-all font-bold"
                >
                  AI Dashboard
                </button>
              )}
              {selectedLandmark === 'cloud' && (
                <button
                  onClick={() => setSelectedOverlay('cloud')}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 transition-all font-bold"
                >
                  Cloud Dashboard
                </button>
              )}
              {selectedLandmark === 'innovation' && (
                <button
                  onClick={() => setSelectedOverlay('projects')}
                  className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-[10px] font-mono text-purple-200 transition-all font-bold"
                >
                  Projects Gallery
                </button>
              )}
              <button
                onClick={() => setSelectedLandmark(null)}
                className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-[10px] font-mono text-red-300 transition-all"
                title="Deselect Landmark"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2c. TASK 4: Lightweight Floating UI Identification Label on Hover */}
      {hoveredLandmark && !selectedLandmark && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-zinc-950/95 border border-cyan-400/40 backdrop-blur-md shadow-xl text-xs font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-cyan-300">
              {hoveredLandmark === 'hq'
                ? 'DEVELOPER HQ'
                : hoveredLandmark === 'skills'
                  ? 'SKILLS & TECHNOLOGY TOWER'
                  : hoveredLandmark === 'career'
                    ? 'CAREER & EXPERIENCE CENTER'
                    : hoveredLandmark === 'about'
                      ? 'ABOUT ME STUDIO'
                      : hoveredLandmark === 'contact'
                        ? 'CONTACT & COLLABORATION HUB'
                        : hoveredLandmark === 'ai'
                          ? 'AI RESEARCH CENTER'
                          : hoveredLandmark === 'cloud'
                            ? 'CLOUD ECOSYSTEM HUB'
                            : 'INNOVATION & PROJECTS CENTER'}
            </span>
            <span className="text-zinc-400">— Click to Select & Focus Camera</span>
          </div>
        </div>
      )}



      {/* 3. Bottom Controls Helper Overlay */}
      <div className="absolute bottom-5 left-5 z-30 pointer-events-none hidden sm:block">
        <div className="bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 text-zinc-400 font-mono text-[11px] space-y-1 shadow-xl">
          <div className="flex items-center gap-1.5 text-white font-bold text-[10px] uppercase tracking-wider">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>US Downtown Navigation ({cameraMode.toUpperCase()})</span>
          </div>
          {cameraMode === 'avatar' ? (
            <div className="flex items-center gap-2.5 text-zinc-300">
              <span className="text-emerald-400 font-bold">[WASD / Arrows] Walk</span>
              <span>•</span>
              <span className="text-cyan-400">[Shift] Sprint</span>
              <span>•</span>
              <span className="text-amber-400">[Mouse Drag] Orbit</span>
              <span>•</span>
              <span className="text-purple-400">[Scroll] Zoom</span>
              <span>•</span>
              <span className="text-pink-400 font-bold">[E] Explore</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">[R] Reset Cam</span>
            </div>
          ) : cameraMode === 'orbit' ? (
            <div className="flex items-center gap-3 text-zinc-300">
              <span>[Left Drag] Orbit</span>
              <span>•</span>
              <span>[Scroll] Zoom</span>
              <span>•</span>
              <span>[Right Drag] Pan</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">[R] Reset Cam</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-zinc-300">
              <span>[WASD / Arrows] Walk</span>
              <span>•</span>
              <span>[Mouse Drag] Look</span>
              <span>•</span>
              <span>[Shift] Sprint</span>
              <span>•</span>
              <span>[Q / E] Turn</span>
            </div>
          )}
          {showNavDebug && (
            <div className="pt-1 border-t border-white/10 text-[10px] flex items-center gap-2">
              <span className="text-cyan-400 font-bold">Cyan:</span> Straight Lanes
              <span className="text-pink-400 font-bold ml-1">Pink:</span> Turns
              <span className="text-emerald-400 font-bold ml-1">Green:</span> Sidewalk
              <span className="text-amber-400 font-bold ml-1">Gold:</span> A* Route
            </div>
          )}
        </div>
      </div>

      {/* 4. Real-Time Performance Monitor Overlay */}
      <PerformanceMonitorHUD />

      {/* 5. Interactive Portfolio District Modal Overlays */}
      <HeroBuildingOverlay
        isOpen={selectedOverlay === 'hero'}
        onClose={() => setSelectedOverlay(null)}
        onExplorePortfolio={() => {
          setSelectedOverlay(null);
          router.push('/experience');
        }}
      />
      <AboutBuildingOverlay
        isOpen={selectedOverlay === 'about'}
        initialTab={aboutInitialTab}
        onClose={() => setSelectedOverlay(null)}
      />
      <ProjectsBuildingOverlay
        isOpen={selectedOverlay === 'projects'}
        initialProjectId={selectedProjectId}
        onClose={() => {
          setSelectedOverlay(null);
          setSelectedProjectId(null);
        }}
      />
      <SkillsBuildingOverlay
        isOpen={selectedOverlay === 'skills'}
        initialFloor={selectedSkillFloor}
        onSelectFloor3D={(floorIndex) => setSelectedSkillFloor(floorIndex)}
        onClose={() => {
          setSelectedOverlay(null);
          setSelectedSkillFloor(null);
        }}
      />
      <CareerBuildingOverlay
        isOpen={selectedOverlay === 'career' || selectedOverlay === 'experience'}
        initialTab={careerInitialTab}
        onClose={() => setSelectedOverlay(null)}
      />
      <ContactBuildingOverlay
        isOpen={selectedOverlay === 'contact'}
        initialTab={contactInitialTab}
        onClose={() => setSelectedOverlay(null)}
      />
      <AIResearchOverlay
        isOpen={selectedOverlay === 'ai'}
        initialTab={aiInitialTab}
        onClose={() => setSelectedOverlay(null)}
      />
      <CloudHubOverlay
        isOpen={selectedOverlay === 'cloud'}
        onClose={() => setSelectedOverlay(null)}
      />

      {/* 6. Phase 3.0 Avatar Interaction Prompt & Mobile Touch Controls */}
      <PointerLockOverlay />
      <AvatarInteractionPrompt
        onInteract={(id) => {
          if (id === 'hq') setSelectedOverlay('hero');
          else if (id === 'innovation') setSelectedOverlay('projects');
          else if (id === 'skills') setSelectedOverlay('skills');
          else if (id === 'career') setSelectedOverlay('career');
          else if (id === 'about') setSelectedOverlay('about');
          else if (id === 'contact') setSelectedOverlay('contact');
          else if (id === 'ai') setSelectedOverlay('ai');
          else if (id === 'cloud') setSelectedOverlay('cloud');
        }}
      />
      <AvatarMobileControls
        onInteract={(id) => {
          if (id === 'hq') setSelectedOverlay('hero');
          else if (id === 'innovation') setSelectedOverlay('projects');
          else if (id === 'skills') setSelectedOverlay('skills');
          else if (id === 'career') setSelectedOverlay('career');
          else if (id === 'about') setSelectedOverlay('about');
          else if (id === 'contact') setSelectedOverlay('contact');
          else if (id === 'ai') setSelectedOverlay('ai');
          else if (id === 'cloud') setSelectedOverlay('cloud');
        }}
      />
    </div>
  );
};
